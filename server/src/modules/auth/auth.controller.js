/**
 * @module modules/auth/auth.controller
 * @description Request handlers for authentication routes.
 *
 * Each handler delegates business logic to auth.service.js and
 * responds with ApiResponse. Cookies are set/cleared here.
 */

import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import { accessCookieOptions, refreshCookieOptions, clearCookieOptions } from '../../utils/cookieOptions.js';
import * as authService from './auth.service.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Set access and refresh tokens in httpOnly cookies AND return them in the
 * response body so the client can choose where to store the access token.
 */
const setTokenCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, accessCookieOptions);
  res.cookie('refreshToken', refreshToken, refreshCookieOptions);
};

const clearTokenCookies = (res) => {
  res.clearCookie('accessToken', clearCookieOptions);
  res.clearCookie('refreshToken', { ...clearCookieOptions, path: '/api/v1/auth/refresh' });
};

// ─── Register ─────────────────────────────────────────────────────────────────

export const register = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.registerUser({
    name,
    username,
    email,
    password,
  });

  setTokenCookies(res, accessToken, refreshToken);

  return res.status(201).json(
    new ApiResponse(
      201,
      { user, accessToken },
      'Account created successfully'
    )
  );
});

// ─── Login ────────────────────────────────────────────────────────────────────

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.loginUser({ email, password });

  setTokenCookies(res, accessToken, refreshToken);

  return res.status(200).json(
    new ApiResponse(200, { user, accessToken }, 'Logged in successfully')
  );
});

// ─── Logout ───────────────────────────────────────────────────────────────────

export const logout = asyncHandler(async (req, res) => {
  await authService.logoutUser(req.user._id);
  clearTokenCookies(res);

  return res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

// ─── Refresh Tokens ───────────────────────────────────────────────────────────

export const refresh = asyncHandler(async (req, res) => {
  // Accept token from cookie OR request body (for mobile clients)
  const incomingToken = req.cookies?.refreshToken || req.body?.refreshToken;
  const { accessToken, refreshToken } = await authService.refreshTokens(incomingToken);

  setTokenCookies(res, accessToken, refreshToken);

  return res.status(200).json(
    new ApiResponse(200, { accessToken }, 'Token refreshed successfully')
  );
});

// ─── Get Current User ─────────────────────────────────────────────────────────

export const getMe = asyncHandler(async (req, res) => {
  // req.user is already populated by the protect middleware
  const user = await authService.getCurrentUser(req.user._id);
  return res.status(200).json(new ApiResponse(200, { user }, 'User fetched successfully'));
});

// ─── Change Password ──────────────────────────────────────────────────────────

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.user._id, { currentPassword, newPassword });

  // Invalidate session cookies after password change
  clearTokenCookies(res);

  return res.status(200).json(
    new ApiResponse(200, null, 'Password changed successfully. Please log in again.')
  );
});

// ─── Forgot Password ──────────────────────────────────────────────────────────

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { resetToken, user } = await authService.forgotPassword(email);

  // In a real application, send an email here:
  //   await emailService.sendPasswordReset(user.email, resetToken);
  //
  // For development, we return the token directly.
  // In production, remove resetToken from the response and only email it.
  const data =
    process.env.NODE_ENV === 'development' ? { resetToken } : null;

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      'If an account with that email exists, a password reset link has been sent.'
    )
  );
});

// ─── Reset Password ───────────────────────────────────────────────────────────

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  await authService.resetPassword(token, password);
  clearTokenCookies(res);

  return res.status(200).json(
    new ApiResponse(200, null, 'Password has been reset successfully. Please log in.')
  );
});
