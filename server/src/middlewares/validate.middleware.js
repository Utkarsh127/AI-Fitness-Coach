/**
 * @module middlewares/validate.middleware
 * @description express-validator result checker.
 *
 * Reads the validation result produced by express-validator chains
 * and immediately returns a 422 response with structured field errors
 * if validation fails. Otherwise passes control to the next handler.
 */

import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

/**
 * Middleware that checks for express-validator errors.
 * Must be placed AFTER the validation chain(s) and BEFORE the controller.
 */
const validate = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Map to a clean [{field, message}] array
    const fieldErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    return next(new ApiError(422, 'Validation failed', fieldErrors));
  }

  return next();
};

export default validate;
