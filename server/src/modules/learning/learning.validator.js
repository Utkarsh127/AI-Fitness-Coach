/**
 * @module modules/learning/learning.validator
 * @description Validators for the Learning Hub routes.
 */

import { query, param } from 'express-validator';

export const getVideosValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('category').optional().trim(),
  query('difficulty').optional().isIn(['Beginner', 'Intermediate', 'Advanced', 'All Levels']),
  query('search').optional().trim(),
  query('isFeatured').optional().isBoolean().toBoolean(),
];

export const videoIdValidator = [
  param('id').isMongoId().withMessage('Invalid video ID'),
];
