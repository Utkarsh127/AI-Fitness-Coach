/**
 * @module modules/exercise/exercise.routes
 * @description Express router for the Exercise Library.
 * Base path: /api/v1/exercises
 */

import { Router } from 'express';
import { protect, authorize } from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import {
  createExerciseValidator,
  updateExerciseValidator,
  searchExerciseValidator,
} from './exercise.validator.js';
import {
  getExercises,
  getExerciseById,
  getExerciseBySlug,
  createExercise,
  updateExercise,
  deleteExercise,
} from './exercise.controller.js';

const router = Router();

// Publicly authenticated routes (any logged-in user can read exercises)
router.use(protect);

router.get('/', searchExerciseValidator, validate, getExercises);
router.get('/:id([0-9a-fA-F]{24})', getExerciseById);
router.get('/slug/:slug', getExerciseBySlug);

// Admin-only routes for managing the exercise library
router.use(authorize('admin'));

router.post('/', createExerciseValidator, validate, createExercise);
router.put('/:id', updateExerciseValidator, validate, updateExercise);
router.delete('/:id', deleteExercise);

export default router;
