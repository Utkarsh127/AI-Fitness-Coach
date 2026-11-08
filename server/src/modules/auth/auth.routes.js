/**
 * @module modules/auth/auth.routes
 * @description Express router for authentication endpoints.
 *
 * Base path (mounted in app.js): /api/v1/auth
 *
 * Public routes:
 *  POST /register
 *  POST /login
 *  POST /refresh
 *  POST /forgot-password
 *  POST /reset-password/:token
 *
 * Protected routes (require valid access token):
 *  GET  /me
 *  POST /logout
 *  PUT  /change-password
 */

import { Router } from 'express';
import { authLimiter } from '../../middlewares/rateLimiter.middleware.js';
import { protect } from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from './auth.validator.js';
import {
  register,
  login,
  logout,
  refresh,
  getMe,
  changePassword,
  forgotPassword,
  resetPassword,
} from './auth.controller.js';

const router = Router();

// Apply auth-specific rate limiter to all routes in this router
router.use(authLimiter);

// ─── Public routes ────────────────────────────────────────────────────────────
router.post('/register',       registerValidator,       validate, register);
router.post('/login',          loginValidator,          validate, login);
router.post('/refresh',        refresh);
router.post('/forgot-password', forgotPasswordValidator, validate, forgotPassword);
router.post('/reset-password/:token', resetPasswordValidator, validate, resetPassword);

// ─── Protected routes ─────────────────────────────────────────────────────────
router.use(protect); // All routes below require authentication

router.get('/me',              getMe);
router.post('/logout',         logout);
router.put('/change-password', changePasswordValidator, validate, changePassword);

export default router;
