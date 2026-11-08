/**
 * @module models/notification.model
 * @description Mongoose schema for User Notifications.
 */

import mongoose from 'mongoose';

const NOTIFICATION_TYPES = [
  'Like', 'Comment', 'Reply', 'Mention', 'Post Shared', 
  'Workout Completed', 'Workout Reminder', 'Achievement', 
  'PR Achieved', 'Friend Request', 'New Chat Message', 
  'Group Invitation', 'Group Update', 'Profile Mention', 'System Notification'
];

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String, // Optional image URL for the notification
    },
    actionUrl: {
      type: String, // Frontend route to navigate to on click
    },
    entityType: {
      type: String, // e.g., 'Post', 'Message', 'WorkoutLog'
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId, // ID of the referenced entity
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high'],
      default: 'normal',
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index for querying unread notifications for a user quickly
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
