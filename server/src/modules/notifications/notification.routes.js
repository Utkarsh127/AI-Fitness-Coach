/**
 * @module modules/notifications/notification.routes
 * @description Express router for the Notification System.
 * Base path: /api/v1/notifications
 */

import { Router } from 'express';
import { protect } from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { getNotificationsValidator, notificationIdValidator } from './notification.validator.js';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAll
} from './notification.controller.js';

const router = Router();

router.use(protect);

router.get('/', getNotificationsValidator, validate, getNotifications);
router.get('/count', getUnreadCount);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', notificationIdValidator, validate, markAsRead);
router.delete('/clear', clearAll);
router.delete('/:id', notificationIdValidator, validate, deleteNotification);

export default router;
