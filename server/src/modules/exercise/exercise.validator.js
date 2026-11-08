/**
 * @module modules/exercise/exercise.validator
 * @description Validation rules for exercises.
 */

import { body, query } from 'express-validator';

const EXERCISE_CATEGORIES = ['Calisthenics', 'Strength Training', 'Hybrid', 'Mobility', 'Conditioning'];
const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Elite'];
const EXERCISE_TYPES = ['Strength', 'Hypertrophy', 'Endurance', 'Skill', 'Mobility', 'Conditioning', 'Recovery'];

export const createExerciseValidator = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('slug').notEmpty().withMessage('Slug is required').trim().toLowerCase(),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isIn(EXERCISE_CATEGORIES).withMessage('Invalid category'),
  body('difficulty').isIn(DIFFICULTY_LEVELS).withMessage('Invalid difficulty'),
  body('exerciseType').isIn(EXERCISE_TYPES).withMessage('Invalid exercise type'),
  body('muscleGroups').isArray({ min: 1 }).withMessage('At least one muscle group is required'),
  body('equipment').optional().isArray(),
  body('instructions').isArray({ min: 1 }).withMessage('At least one instruction step is required'),
];

export const updateExerciseValidator = [
  body('name').optional().trim(),
  body('slug').optional().trim().toLowerCase(),
  body('category').optional().isIn(EXERCISE_CATEGORIES).withMessage('Invalid category'),
  body('difficulty').optional().isIn(DIFFICULTY_LEVELS).withMessage('Invalid difficulty'),
  body('exerciseType').optional().isIn(EXERCISE_TYPES).withMessage('Invalid exercise type'),
  body('muscleGroups').optional().isArray(),
  body('equipment').optional().isArray(),
  body('instructions').optional().isArray(),
];

export const searchExerciseValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('search').optional().trim(),
  query('category').optional().trim(),
  query('difficulty').optional().trim(),
  query('muscle').optional().trim(),
  query('equipment').optional().trim(),
];
