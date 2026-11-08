/**
 * @module models/conversation.model
 * @description Mongoose schema for Chat Conversations.
 */

import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }],
    type: {
      type: String,
      enum: ['private', 'group'],
      default: 'private',
    },
    groupName: {
      type: String,
      trim: true,
    },
    groupImage: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    admins: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    isArchived: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
conversationSchema.index({ participants: 1, lastActivity: -1 });

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
