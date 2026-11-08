/**
 * @module api/auth.api
 * @description Axios calls for authentication endpoints.
 */

import axiosInstance from './axiosInstance.js';

/** Register a new user. */
export const register = (data) =>
  axiosInstance.post('/auth/register', data);

/** Login with email and password. */
export const login = (credentials) =>
  axiosInstance.post('/auth/login', credentials);

/** Logout the current user. */
export const logout = () =>
  axiosInstance.post('/auth/logout');

/** Use the httpOnly refresh token cookie to get a new access token. */
export const refreshToken = () =>
  axiosInstance.post('/auth/refresh');

/** Get the currently authenticated user. */
export const getMe = () =>
  axiosInstance.get('/auth/me');

/** Change the authenticated user's password. */
export const changePassword = (data) =>
  axiosInstance.put('/auth/change-password', data);

/** Initiate a forgot-password flow (sends reset email). */
export const forgotPassword = (email) =>
  axiosInstance.post('/auth/forgot-password', { email });

/** Complete a password reset using the token from the reset email. */
export const resetPassword = (token, data) =>
  axiosInstance.post(`/auth/reset-password/${token}`, data);
