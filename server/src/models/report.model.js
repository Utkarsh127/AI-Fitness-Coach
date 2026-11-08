/**
 * @module models/report.model
 * @description Mongoose schema for user reports against posts, messages, or users.
 */

import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetType: {
      type: String,
      enum: ['Post', 'Message', 'User'],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // Ref can be dynamic, but we just store the ID here and populate based on targetType if needed
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Reason cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewing', 'Resolved', 'Dismissed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes to speed up admin queries
reportSchema.index({ status: 1 });
reportSchema.index({ targetType: 1, targetId: 1 });
reportSchema.index({ createdAt: -1 });

const Report = mongoose.model('Report', reportSchema);
export default Report;
