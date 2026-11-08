/**
 * @module middlewares/error.middleware
 * @description Centralised Express error handler.
 *
 * Catches all errors thrown/passed via next(err) throughout the app.
 * Maps Mongoose, JWT, and custom ApiError instances to appropriate
 * HTTP status codes and structured JSON responses.
 *
 * Never leaks stack traces or internal error details to the client
 * in production.
 */

import ApiError from '../utils/ApiError.js';
import logger from '../config/logger.js';

/**
 * Global error-handling middleware.
 * Must have exactly 4 arguments so Express identifies it as an error handler.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  let error = err;

  // Log the original error server-side
  logger.error(`${req.method} ${req.originalUrl} — ${err.message}`, {
    stack: err.stack,
    statusCode: err.statusCode,
  });

  // ─── Mongoose: document not found ─────────────────────────────────────────
  if (err.name === 'CastError') {
    error = new ApiError(404, `Resource not found with id: ${err.value}`);
  }

  // ─── Mongoose: duplicate key ───────────────────────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue?.[field];
    error = new ApiError(409, `${field} '${value}' is already in use.`);
  }

  // ─── Mongoose: validation error ────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    const fieldErrors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error = new ApiError(422, 'Validation failed', fieldErrors);
  }

  // ─── JWT errors ─────────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token. Please log in again.');
  }

  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Session expired. Please log in again.');
  }

  // ─── Cloudinary Upload Errors ───────────────────────────────────────────────
  if (err.message && err.message.includes('Server returned unexpected status code - 403')) {
    error = new ApiError(400, 'Image upload failed. Cloudinary quota exceeded. Please try again later.');
  }

  // ─── Multer Errors ────────────────────────────────────────────────────────
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error = new ApiError(400, 'File too large. Maximum size is 5MB.');
    } else {
      error = new ApiError(400, `Upload error: ${err.message}`);
    }
  }

  // ─── Fallback: unknown errors ──────────────────────────────────────────────
  const statusCode = error.statusCode || 500;
  const message =
    statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'An internal server error occurred.'
      : error.message;

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: error.errors || [],
    // Only expose stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
