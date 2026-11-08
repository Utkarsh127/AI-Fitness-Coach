/**
 * @module modules/workout/workout.routes
 * @description Express router for Workout Plans and Logs.
 * Base path: /api/v1/workouts
 */

import { Router } from 'express';
import { protect } from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { createWorkoutPlanValidator, updateWorkoutPlanValidator, logWorkoutValidator } from './workout.validator.js';
import {
  getWorkoutPlans,
  getWorkoutPlanById,
  createWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
  logWorkout,
  getWorkoutHistory,
  getWorkoutStats,
  getPersonalRecords
} from './workout.controller.js';

const router = Router();

// All workout routes require authentication
router.use(protect);

// ─── Workout Plans ─────────────────────────────────────────────────────────────
router.get('/plans', getWorkoutPlans);
router.post('/plans', createWorkoutPlanValidator, validate, createWorkoutPlan);
router.get('/plans/:id([0-9a-fA-F]{24})', getWorkoutPlanById);
router.put('/plans/:id([0-9a-fA-F]{24})', updateWorkoutPlanValidator, validate, updateWorkoutPlan);
router.delete('/plans/:id([0-9a-fA-F]{24})', deleteWorkoutPlan);

// ─── Workout Logs & History ────────────────────────────────────────────────────
router.get('/history', getWorkoutHistory);
router.post('/logs', logWorkoutValidator, validate, logWorkout);

// ─── Stats & PRs ───────────────────────────────────────────────────────────────
router.get('/stats', getWorkoutStats);
router.get('/prs', getPersonalRecords);

export default router;
