/**
 * @module modules/auth/auth.service
 * @description Business logic for authentication.
 *
 * All methods throw ApiError on failure.
 * Controllers call these methods and pass results to ApiResponse.
 */

import crypto from 'crypto';
import User from '../../models/user.model.js';
import ApiError from '../../utils/ApiError.js';
import { verifyRefreshToken } from '../../utils/jwt.js';

// ─── Register ─────────────────────────────────────────────────────────────────

/**
 * Register a new user.
 * @param {{ name, username, email, password }} data
 * @returns {Promise<{ user, accessToken, refreshToken }>}
 */
export const registerUser = async ({ name, username, email, password }) => {
  // Check for duplicate email or username
  const existing = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existing) {
    if (existing.email === email) {
      throw new ApiError(409, 'An account with this email already exists.');
    }
    throw new ApiError(409, 'This username is already taken.');
  }

  // Create user — password hashed in pre-save hook
  const user = await User.create({ name, username, email, password });

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Hash and persist refresh token
  user.refreshToken = User.hashRefreshToken(refreshToken);
  await user.save({ validateBeforeSave: false });

  return { user, accessToken, refreshToken };
};

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * Authenticate a user with email and password.
 * @param {{ email, password }} credentials
 * @returns {Promise<{ user, accessToken, refreshToken }>}
 */
export const loginUser = async ({ email, password }) => {
  // Explicitly select password (excluded by default)
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    // Intentionally vague message to prevent user enumeration
    throw new ApiError(401, 'Invalid email or password.');
  }

  if (!user.isActive) {
    throw new ApiError(401, 'Your account has been deactivated. Please contact support.');
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = User.hashRefreshToken(refreshToken);
  await user.save({ validateBeforeSave: false });

  return { user, accessToken, refreshToken };
};

// ─── Logout ───────────────────────────────────────────────────────────────────

/**
 * Invalidate the user's refresh token (server-side logout).
 * @param {string} userId
 */
export const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null }, { new: false });
};

// ─── Refresh Token ────────────────────────────────────────────────────────────

/**
 * Use a refresh token to issue a new access token + refresh token pair.
 * Implements refresh-token rotation to invalidate old tokens.
 *
 * @param {string} incomingRefreshToken
 * @returns {Promise<{ accessToken, refreshToken }>}
 */
export const refreshTokens = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Refresh token is missing.');
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(incomingRefreshToken);
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token. Please log in again.');
  }

  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user) throw new ApiError(401, 'User not found.');

  // Verify token matches stored hash (rotation check)
  const hashedIncoming = User.hashRefreshToken(incomingRefreshToken);
  if (user.refreshToken !== hashedIncoming) {
    // Token reuse detected — invalidate all sessions
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(401, 'Refresh token reuse detected. Please log in again.');
  }

  // Issue new token pair
  const accessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  user.refreshToken = User.hashRefreshToken(newRefreshToken);
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken: newRefreshToken };
};

// ─── Get Current User ─────────────────────────────────────────────────────────

/**
 * Fetch the current authenticated user.
 * The user object is already attached to req by the protect middleware.
 * @param {string} userId
 * @returns {Promise<User>}
 */
export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found.');
  return user;
};

// ─── Change Password ──────────────────────────────────────────────────────────

/**
 * Change the authenticated user's password.
 * @param {string} userId
 * @param {{ currentPassword, newPassword }} data
 */
export const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new ApiError(404, 'User not found.');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new ApiError(401, 'Current password is incorrect.');

  user.password = newPassword; // Pre-save hook will hash it
  // Invalidate all existing refresh tokens on password change
  user.refreshToken = null;
  await user.save();
};

// ─── Forgot Password ──────────────────────────────────────────────────────────

/**
 * Initiate the forgot-password flow.
 * Generates a reset token and returns it for the caller to email.
 *
 * @param {string} email
 * @returns {Promise<{ resetToken, user }>}
 */
export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  // Always respond with the same message regardless of whether the user exists
  // to prevent user enumeration attacks.
  if (!user) {
    return { resetToken: null, user: null };
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  return { resetToken, user };
};

// ─── Reset Password ───────────────────────────────────────────────────────────

/**
 * Complete the password-reset flow.
 * @param {string} rawToken  - The unhashed token from the URL
 * @param {string} newPassword
 */
export const resetPassword = async (rawToken, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) {
    throw new ApiError(400, 'Password reset token is invalid or has expired.');
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = null; // Invalidate all sessions after reset
  await user.save();
};
