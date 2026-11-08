/**
 * @module modules/user/user.routes
 * @description Express router for user profile endpoints.
 *
 * Base path: /api/v1/users
 */

import { Router } from 'express';
import { protect } from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { uploadSingle } from '../../middlewares/upload.middleware.js';
import { onboardingValidator, updateProfileValidator } from './user.validator.js';
import {
  getProfile,
  updateProfile,
  submitOnboarding,
  getOnboardingStatus,
  uploadProfilePicture,
  searchUsers,
  getUserById,
} from './user.controller.js';

const router = Router();

// All user routes require authentication
router.use(protect);

router.get('/me/profile', getProfile);
router.put('/me/profile', updateProfileValidator, validate, updateProfile);
router.patch('/me/profile', updateProfileValidator, validate, updateProfile);

router.post('/me/profile-picture', uploadSingle('profilePicture'), uploadProfilePicture);

router.post('/me/onboarding', onboardingValidator, validate, submitOnboarding);
router.get('/me/onboarding-status', getOnboardingStatus);

// Search all users (for New Chat modal)
router.get('/search', searchUsers);

// Public user profile by ID
router.get('/:userId([0-9a-fA-F]{24})/profile', getUserById);

export default router;
