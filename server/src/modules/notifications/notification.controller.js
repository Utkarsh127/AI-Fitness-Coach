/**
 * @module modules/notifications/notification.controller
 * @description Controllers for the Notification System.
 */

import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import * as notificationService from './notification.service.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.getNotifications(req.user._id, req.query);
  res.status(200).json(new ApiResponse(200, result, 'Notifications fetched successfully'));
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const result = await notificationService.getUnreadCount(req.user._id);
  res.status(200).json(new ApiResponse(200, result, 'Unread count fetched'));
});

export const markAsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAsRead(req.user._id, req.params.id);
  res.status(200).json(new ApiResponse(200, result, 'Notification marked as read'));
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user._id);
  res.status(200).json(new ApiResponse(200, result, 'All notifications marked as read'));
});

export const deleteNotification = asyncHandler(async (req, res) => {
  await notificationService.deleteNotification(req.user._id, req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Notification deleted'));
});

export const clearAll = asyncHandler(async (req, res) => {
  await notificationService.clearAll(req.user._id);
  res.status(200).json(new ApiResponse(200, null, 'All notifications cleared'));
});
