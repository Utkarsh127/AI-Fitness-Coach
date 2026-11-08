/**
 * @module modules/workout/workout.validator
 * @description Validation rules for workout plans and logs.
 */

import { body } from 'express-validator';

export const createWorkoutPlanValidator = [
  body('name').notEmpty().withMessage('Workout name is required').trim(),
  body('goal').notEmpty().withMessage('Goal is required'),
  body('difficulty').isIn(['Beginner', 'Intermediate', 'Advanced', 'Elite']).withMessage('Invalid difficulty'),
  body('durationWeeks').isInt({ min: 1 }).withMessage('Duration must be at least 1 week'),
  body('daysPerWeek').isInt({ min: 1, max: 7 }).withMessage('Days per week must be between 1 and 7'),
  body('days').isArray({ min: 1 }).withMessage('At least one day is required'),
  body('days.*.dayNumber').isInt({ min: 1 }).withMessage('Day number is required'),
  body('days.*.title').notEmpty().withMessage('Day title is required'),
  body('days.*.exercises').isArray().withMessage('Exercises must be an array'),
  body('days.*.exercises.*.exerciseId').isMongoId().withMessage('Invalid exercise ID'),
  body('days.*.exercises.*.sets').isInt({ min: 1 }).withMessage('Sets must be at least 1'),
  body('days.*.exercises.*.reps').notEmpty().withMessage('Reps are required'),
  body('days.*.exercises.*.restTime').isInt({ min: 0 }).withMessage('Rest time cannot be negative'),
];

export const updateWorkoutPlanValidator = [
  body('name').optional().trim(),
  body('goal').optional(),
  body('difficulty').optional().isIn(['Beginner', 'Intermediate', 'Advanced', 'Elite']),
  body('durationWeeks').optional().isInt({ min: 1 }),
  body('daysPerWeek').optional().isInt({ min: 1, max: 7 }),
  body('days').optional().isArray(),
];

export const logWorkoutValidator = [
  body('workoutPlan').optional().isMongoId(),
  body('workoutDay').optional().isMongoId(),
  body('duration').isInt({ min: 1 }).withMessage('Duration is required in minutes'),
  body('exercises').isArray({ min: 1 }).withMessage('At least one logged exercise is required'),
  body('exercises.*.exerciseId').isMongoId().withMessage('Invalid exercise ID'),
  body('exercises.*.sets').isInt({ min: 1 }).withMessage('Sets must be at least 1'),
  body('exercises.*.reps').notEmpty().withMessage('Reps are required'),
  body('totalVolume').optional().isNumeric(),
  body('completed').optional().isBoolean(),
];
