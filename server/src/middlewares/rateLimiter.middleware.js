/**
 * @module middlewares/rateLimiter.middleware
 * @description Pre-configured express-rate-limit instances.
 *
 * Exports:
 *  - globalLimiter   — applied to all API routes
 *  - authLimiter     — stricter limit on /api/v1/auth/* routes
 *  - aiLimiter       — per-user limit on AI coach endpoints
 */

import rateLimit from 'express-rate-limit';

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000; // 15 min default
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000;

/** Applied globally to all /api/v1/* routes */
export const globalLimiter = rateLimit({
  windowMs,
  max: maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});

/** Stricter limiter for authentication endpoints */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,                    // max 1000 auth attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Only count failed requests
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again in 15 minutes.',
  },
});

/** Per-user limit for AI coach endpoints */
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,             // 10 AI requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id || req.ip,
  message: {
    success: false,
    message: 'Too many AI requests, please slow down.',
  },
});

/** Specific limiter for external API proxy endpoints (e.g., YouTube API) */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,             // max 30 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id || req.ip,
  message: {
    success: false,
    message: 'Too many external API requests, please try again later.',
  },
});
