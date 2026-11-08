/**
 * @module modules/notifications/notification.validator
 * @description Validators for the Notification System.
 */

import { query, param, body } from 'express-validator';

export const getNotificationsValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('isRead').optional().isBoolean().toBoolean(),
];

export const notificationIdValidator = [
  param('id').isMongoId().withMessage('Invalid notification ID'),
];
