/**
 * @module models/message.model
 * @description Mongoose schema for Chat Messages.
 */

import mongoose from 'mongoose';

const MESSAGE_TYPES = [
  'Text', 'Image', 'File', 'System', 
  'Workout Share', 'Exercise Share', 'Progress Share'
];

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
    messageType: {
      type: String,
      enum: MESSAGE_TYPES,
      default: 'Text',
    },
    attachments: [{
      type: String, // Cloudinary URLs
    }],
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    isForwarded: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedFor: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    readBy: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      readAt: { type: Date, default: Date.now }
    }],
    deliveredTo: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      deliveredAt: { type: Date, default: Date.now }
    }]
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
messageSchema.index({ conversation: 1, createdAt: 1 });
messageSchema.index({ content: 'text' });

const Message = mongoose.model('Message', messageSchema);
export default Message;
