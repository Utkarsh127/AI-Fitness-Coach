/**
 * @module utils/cookieOptions
 * @description Shared httpOnly cookie configuration for JWT storage.
 *
 * Exports accessCookieOptions and refreshCookieOptions objects
 * used by auth endpoints when setting tokens as secure cookies.
 */

const isProd = process.env.NODE_ENV === 'production';

/**
 * Cookie options for the short-lived access token.
 * httpOnly prevents client JS from reading the token (XSS protection).
 * sameSite: 'strict' prevents CSRF.
 */
export const accessCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'strict' : 'lax',
  maxAge: 15 * 60 * 1000, // 15 minutes in ms
};

/**
 * Cookie options for the long-lived refresh token.
 * A longer maxAge lets silent refreshes continue across sessions.
 */
export const refreshCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'strict' : 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
  path: '/api/v1/auth/refresh', // Scope to refresh endpoint only
};

/**
 * Cookie options used when clearing / expiring a cookie.
 */
export const clearCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'strict' : 'lax',
};
