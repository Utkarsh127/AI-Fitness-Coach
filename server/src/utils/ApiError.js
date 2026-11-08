/**
 * @module utils/ApiError
 * @description Custom error class for operational (expected) errors.
 *
 * Extends the native Error with a statusCode and optional field-level
 * errors array (for validation failures). The centralised error middleware
 * uses instanceof checks to distinguish ApiError from unexpected errors.
 *
 * Usage:
 *   throw new ApiError(404, 'User not found');
 *   throw new ApiError(422, 'Validation failed', errors);
 */

class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message    - Human-readable error message
   * @param {Array}  errors     - Optional field-level validation errors
   * @param {string} stack      - Optional custom stack trace
   */
  constructor(statusCode, message = 'Something went wrong', errors = [], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
