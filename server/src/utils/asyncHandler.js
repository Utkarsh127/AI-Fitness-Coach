/**
 * @module utils/asyncHandler
 * @description Wraps async route handlers to forward errors to next().
 *
 * Usage:
 *   router.get('/path', asyncHandler(async (req, res) => { ... }));
 */

/**
 * Wraps an async Express handler and forwards any thrown errors to next().
 * @param {Function} fn - Async Express route handler
 * @returns {Function} Standard Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
