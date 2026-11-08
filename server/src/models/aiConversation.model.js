/**
 * @module models/aiConversation.model
 * @description Mongoose schema for AI Coach conversations.
 */

import mongoose from 'mongoose';

const aiMessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt to messages
  }
);

const aiConversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'New Conversation',
      trim: true,
      maxlength: 100,
    },
    messages: [aiMessageSchema],
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Index to quickly fetch a user's recent conversations
aiConversationSchema.index({ user: 1, lastMessageAt: -1 });

const AiConversation = mongoose.model('AiConversation', aiConversationSchema);

export default AiConversation;
