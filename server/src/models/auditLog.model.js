/**
 * @module models/auditLog.model
 * @description Mongoose schema for system and admin audit logging.
 */

import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      index: true,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    target: {
      type: mongoose.Schema.Types.ObjectId, // Can be user, post, message ID
      required: false,
    },
    targetModel: {
      type: String, // E.g. 'User', 'Post', 'Message', 'Report'
      required: false,
    },
    details: {
      type: mongoose.Schema.Types.Mixed, // Any JSON object for extra context
      default: {},
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

auditLogSchema.index({ createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
