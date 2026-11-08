/**
 * @module modules/messaging/messaging.validator
 * @description Validators for the Messaging System.
 */

import { body, query, param } from 'express-validator';

export const createConversationValidator = [
  body('participants').isArray({ min: 1 }).withMessage('Participants array must have at least 1 user ID'),
  body('participants.*').isMongoId().withMessage('Invalid participant ID'),
  body('type').optional().isIn(['private', 'group']).withMessage('Invalid conversation type'),
  body('groupName').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Group name must be 1-50 characters'),
];

export const sendMessageValidator = [
  body('conversationId').isMongoId().withMessage('Invalid conversation ID'),
  body('content').optional().trim(),
  body('messageType').optional().isIn(['Text', 'Image', 'File', 'System', 'Workout Share', 'Exercise Share', 'Progress Share']),
  body('replyTo').optional({ checkFalsy: true }).isMongoId(),
  body('isForwarded').optional(),
  body('forwardedAttachments').optional(),
];

export const getMessagesValidator = [
  param('conversationId').isMongoId().withMessage('Invalid conversation ID'),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];
