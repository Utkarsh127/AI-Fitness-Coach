/**
 * @module modules/notifications/notification.service
 * @description Business logic for the Notification System.
 */

import Notification from '../../models/notification.model.js';
import { getPaginatedResults } from '../../utils/pagination.js';
import { getIO } from '../../sockets/socket.js';
import ApiError from '../../utils/ApiError.js';

/**
 * Core function to dispatch a notification and emit via Socket.IO
 */
export const createNotification = async (data) => {
  const { recipient, sender, type, title, message, entityType, entityId, actionUrl } = data;
  
  // Prevent sending notifications to oneself (except system/achievements)
  if (sender && sender.toString() === recipient.toString() && type !== 'Achievement' && type !== 'PR Achieved' && type !== 'Workout Completed') {
    return null;
  }

  // Throttle chat notifications: Only 1 unread notification per chat conversation
  if (type === 'New Chat Message' && entityType === 'Conversation') {
    const existing = await Notification.findOne({
      recipient,
      type: 'New Chat Message',
      entityId,
      isRead: false
    });
    
    if (existing) {
      // Just update the message/time
      existing.message = message;
      existing.updatedAt = Date.now();
      await existing.save();
      emitNotification(recipient, existing);
      return existing;
    }
  }

  const notification = await Notification.create(data);
  const populated = await Notification.findById(notification._id).populate('sender', 'name username profilePicture');
  
  emitNotification(recipient, populated);
  return populated;
};

const emitNotification = (recipientId, notification) => {
  try {
    const io = getIO();
    // Assuming the user joins a room with their userId upon socket connection
    io.to(recipientId.toString()).emit('notification:new', notification);
  } catch (err) {
    console.error('Socket error emitting notification:', err);
  }
};

export const getNotifications = async (userId, query) => {
  const { page = 1, limit = 20, isRead } = query;
  const filter = { recipient: userId };
  if (isRead !== undefined) filter.isRead = isRead;

  const populate = [{ path: 'sender', select: 'name username profilePicture' }];
  return getPaginatedResults(Notification, filter, { page, limit, sort: { createdAt: -1 }, populate });
};

export const getUnreadCount = async (userId) => {
  const count = await Notification.countDocuments({ recipient: userId, isRead: false });
  return { count };
};

export const markAsRead = async (userId, notificationId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true, readAt: Date.now() },
    { new: true }
  );
  if (!notification) throw new ApiError(404, 'Notification not found');
  return notification;
};

export const markAllAsRead = async (userId) => {
  await Notification.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true, readAt: Date.now() }
  );
  return { success: true };
};

export const deleteNotification = async (userId, notificationId) => {
  const result = await Notification.findOneAndDelete({ _id: notificationId, recipient: userId });
  if (!result) throw new ApiError(404, 'Notification not found');
  return { success: true };
};

export const clearAll = async (userId) => {
  await Notification.deleteMany({ recipient: userId });
  return { success: true };
};
