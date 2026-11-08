/**
 * @module middlewares/auth.middleware
 * @description JWT authentication & role-based authorisation middleware.
 *
 * Exports:
 *  - protect(req, res, next)  — verifies Bearer JWT, attaches req.user
 *  - authorize(...roles)      — factory that restricts access by role
 */

import { verifyAccessToken } from '../utils/jwt.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/user.model.js';

/**
 * Protect a route — requires a valid access token.
 *
 * Checks the Authorization header for a Bearer token.
 * Falls back to req.cookies.accessToken for cookie-based auth.
 * Attaches the full user document (without password) to req.user.
 */
export const protect = asyncHandler(async (req, _res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError(401, 'Access denied. No token provided.');
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError'
        ? 'Session expired. Please log in again.'
        : 'Invalid token. Please log in again.';
    throw new ApiError(401, message);
  }

  // Verify the user still exists and is active
  const user = await User.findById(decoded.id).select('-password -refreshToken');
  if (!user) throw new ApiError(401, 'User belonging to this token no longer exists.');
  if (!user.isActive) throw new ApiError(401, 'Your account has been deactivated.');

  req.user = user;
  next();
});

/**
 * Restrict a route to specific roles.
 * Must be used AFTER protect().
 *
 * @param {...string} roles - Allowed role strings
 * @returns {Function} Express middleware
 *
 * @example
 * router.delete('/users/:id', protect, authorize('admin'), handler);
 */
export const authorize = (...roles) =>
  (req, _res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(
        new ApiError(403, `Role '${req.user?.role}' is not authorised to perform this action.`)
      );
    }
    return next();
  };
