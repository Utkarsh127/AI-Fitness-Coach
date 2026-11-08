/**
 * @module utils/jwt
 * @description JWT signing and verification helpers.
 *
 * Exports:
 *  - signAccessToken(payload)  → signed JWT string
 *  - signRefreshToken(payload) → signed refresh JWT string
 *  - verifyAccessToken(token)  → decoded payload | throws
 *  - verifyRefreshToken(token) → decoded payload | throws
 */

import jwt from 'jsonwebtoken';

/**
 * Sign an access token.
 * @param {{ id: string, role: string }} payload
 * @returns {string} Signed JWT
 */
export const signAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });

/**
 * Sign a refresh token.
 * @param {{ id: string }} payload
 * @returns {string} Signed JWT
 */
export const signRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });

/**
 * Verify an access token and return its decoded payload.
 * @param {string} token
 * @returns {object} Decoded payload
 * @throws {JsonWebTokenError | TokenExpiredError}
 */
export const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);

/**
 * Verify a refresh token and return its decoded payload.
 * @param {string} token
 * @returns {object} Decoded payload
 * @throws {JsonWebTokenError | TokenExpiredError}
 */
export const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);
