/**
 * @module modules/report/report.service
 * @description Logic for handling user reports.
 */

import Report from '../../models/report.model.js';
import AuditLog from '../../models/auditLog.model.js';
import User from '../../models/user.model.js';
import ApiError from '../../utils/ApiError.js';
import Notification from '../../models/notification.model.js';

/**
 * Create a report for a post, message, or user.
 */
export const createReport = async (reporterId, data, io) => {
  const { targetType, targetId, reportedUserId, reason } = data;

  if (!['Post', 'Message', 'User'].includes(targetType)) {
    throw new ApiError(400, 'Invalid target type');
  }

  // Ensure reported user exists
  const reportedUser = await User.findById(reportedUserId);
  if (!reportedUser) {
    throw new ApiError(404, 'Reported user not found');
  }

  // Check if reporter already reported this target
  const existing = await Report.findOne({ reporter: reporterId, targetType, targetId, status: { $ne: 'Dismissed' } });
  if (existing) {
    throw new ApiError(400, 'You have already reported this content.');
  }

  // Create report
  const report = await Report.create({
    reporter: reporterId,
    reportedUser: reportedUserId,
    targetType,
    targetId,
    reason,
    status: 'Pending'
  });

  // Create audit log
  await AuditLog.create({
    action: 'CONTENT_REPORTED',
    actor: reporterId,
    target: report._id,
    targetModel: 'Report',
    details: { targetType, targetId, reason }
  });

  // Optional: Emit admin notification if real-time admin socket room exists
  if (io) {
    io.to('admin_room').emit('notification:new', {
      title: 'New Report Received',
      message: `A ${targetType} was reported by a user.`,
      type: 'admin_alert',
      metadata: { reportId: report._id }
    });
  }

  return report;
};
