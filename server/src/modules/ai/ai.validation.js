/**
 * @module modules/ai/ai.validation
 * @description Validation rules for AI endpoints.
 */

import { body } from 'express-validator';

export const validateAiTest = [
  body('message')
    .exists({ checkFalsy: true }).withMessage('Message is required')
    .isString().withMessage('Message must be a string')
    .trim()
    .notEmpty().withMessage('Message cannot be empty')
    .isLength({ max: 500 }).withMessage('Message must be 500 characters or less'),
];

export const validateSendMessage = [
  body('message')
    .exists({ checkFalsy: true }).withMessage('Message is required')
    .isString().withMessage('Message must be a string')
    .trim()
    .notEmpty().withMessage('Message cannot be empty')
    .isLength({ max: 1000 }).withMessage('Message must be 1000 characters or less'),
];

export const validateCreateConversation = [
  body('title')
    .optional()
    .isString().withMessage('Title must be a string')
    .trim()
    .isLength({ max: 100 }).withMessage('Title must be 100 characters or less'),
];

export const validateGenerateWorkout = [
  body('goal').optional().isString().trim(),
  body('daysPerWeek').optional().isInt({ min: 1, max: 7 }),
  body('durationWeeks').optional().isInt({ min: 1, max: 24 }),
  body('difficulty').optional().isIn(['Beginner', 'Intermediate', 'Advanced', 'Elite']),
  body('equipment').optional().isArray(),
  body('focus').optional().isArray(),
  body('sessionDuration').optional().isInt({ min: 10, max: 180 }),
];
