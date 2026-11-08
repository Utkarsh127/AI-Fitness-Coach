/**
 * @module modules/community/community.validator
 * @description Validation rules for Community posts and comments.
 */

import { body, query } from 'express-validator';

const POST_TYPES = [
  'Workout', 'Progress Photo', 'Transformation', 'Achievement',
  'Question', 'General Fitness', 'Nutrition', 'Mobility', 
  'Challenge', 'Calisthenics', 'Hybrid Training'
];

export const createPostValidator = [
  // caption is optional if images are provided, but let's enforce at least one of them at the controller level
  body('caption').optional().trim().isLength({ max: 2000 }).withMessage('Caption cannot exceed 2000 characters'),
  body('postType').optional().isIn(POST_TYPES).withMessage('Invalid post type'),
  body('tags').optional().isString().customSanitizer(value => value.split(',').map(t => t.trim().toLowerCase()).filter(t => t)),
  body('visibility').optional().isIn(['Public', 'Followers', 'Private']).withMessage('Invalid visibility'),
  body('location').optional().trim(),
  body('workoutReference').optional().isMongoId(),
  body('progressReference').optional().isMongoId(),
];

export const updatePostValidator = [
  body('caption').optional().trim().isLength({ max: 2000 }),
  body('postType').optional().isIn(POST_TYPES),
  body('tags').optional().isString().customSanitizer(value => value.split(',').map(t => t.trim().toLowerCase()).filter(t => t)),
  body('visibility').optional().isIn(['Public', 'Followers', 'Private']),
];

export const commentValidator = [
  body('message').notEmpty().withMessage('Message is required').trim().isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters'),
  body('parentComment').optional({ checkFalsy: true }).isMongoId().withMessage('Invalid parent comment ID'),
];

export const searchFeedValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('search').optional().trim(),
  query('postType').optional().trim(),
  query('tag').optional().trim(),
];
