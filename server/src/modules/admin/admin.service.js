/**
 * @module modules/admin/admin.service
 * @description Business logic for admin user management.
 */

import User from '../../models/user.model.js';
import Report from '../../models/report.model.js';
import AuditLog from '../../models/auditLog.model.js';
import Post from '../../models/post.model.js';
import Message from '../../models/message.model.js';
import ApiError from '../../utils/ApiError.js';
import { getPaginatedResults } from '../../utils/pagination.js';
import cloudinary from '../../config/cloudinary.js';

export const getUsers = async (query) => {
  const { page = 1, limit = 10, search, role, status } = query;
  
  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } }
    ];
  }
  if (role) filter.role = role;
  if (status) {
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;
  }

  return getPaginatedResults(User, filter, { 
    page, 
    limit, 
    sort: { createdAt: -1 },
    select: '-password -refreshToken -passwordResetToken -passwordResetExpires'
  });
};

export const getUserById = async (id) => {
  const user = await User.findById(id).select('-password -refreshToken -passwordResetToken -passwordResetExpires');
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

export const createUser = async (data) => {
  const { name, email, username, password, role = 'user' } = data;
  
  const existingEmail = await User.findOne({ email });
  if (existingEmail) throw new ApiError(400, 'Email already exists');
  
  const existingUsername = await User.findOne({ username });
  if (existingUsername) throw new ApiError(400, 'Username already exists');

  const user = await User.create({
    name,
    email,
    username,
    password,
    role,
    isEmailVerified: true // Assume admin created users are verified
  });

  return User.findById(user._id).select('-password -refreshToken -passwordResetToken -passwordResetExpires');
};

export const updateUser = async (adminUserId, targetUserId, data) => {
  const user = await User.findById(targetUserId);
  if (!user) throw new ApiError(404, 'User not found');

  // Prevent demoting the last active admin
  if (data.role === 'user' && user.role === 'admin') {
    const adminCount = await User.countDocuments({ role: 'admin', isActive: true });
    if (adminCount <= 1) {
      throw new ApiError(400, 'Cannot demote the last remaining active admin');
    }
  }

  if (data.email && data.email !== user.email) {
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new ApiError(400, 'Email already exists');
  }

  if (data.username && data.username !== user.username) {
    const existing = await User.findOne({ username: data.username });
    if (existing) throw new ApiError(400, 'Username already exists');
  }

  Object.assign(user, data);
  await user.save();

  return User.findById(user._id).select('-password -refreshToken -passwordResetToken -passwordResetExpires');
};

export const deactivateUser = async (adminUserId, targetUserId) => {
  if (adminUserId.toString() === targetUserId.toString()) {
    throw new ApiError(403, 'You cannot deactivate your own account. Ask another admin to perform this action.');
  }

  const user = await User.findById(targetUserId);
  if (!user) throw new ApiError(404, 'User not found');

  if (user.role === 'admin' && user.isActive) {
    const adminCount = await User.countDocuments({ role: 'admin', isActive: true });
    if (adminCount <= 1) {
      throw new ApiError(400, 'Cannot deactivate the last remaining active admin');
    }
  }

  user.isActive = false;
  await user.save();

  return { id: user._id, isActive: false };
};

// ─── ADMIN STATS ─────────────────────────────────────────────────────────────
export const getAdminStats = async () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    activeUsers,
    admins,
    totalPosts,
    totalMessages,
    pendingReports,
    resolvedReports,
    newUsersToday,
    newPostsToday
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    User.countDocuments({ role: 'admin' }),
    Post.countDocuments(),
    Message.countDocuments(),
    Report.countDocuments({ status: 'Pending' }),
    Report.countDocuments({ status: 'Resolved' }),
    User.countDocuments({ createdAt: { $gte: startOfDay } }),
    Post.countDocuments({ createdAt: { $gte: startOfDay } })
  ]);

  return {
    totalUsers,
    activeUsers,
    admins,
    totalPosts,
    totalMessages,
    pendingReports,
    resolvedReports,
    newUsersToday,
    newPostsToday
  };
};

// ─── AUDIT LOGS ─────────────────────────────────────────────────────────────
export const getAuditLogs = async (query) => {
  const { page = 1, limit = 20, action } = query;
  const filter = {};
  if (action) filter.action = action;

  return getPaginatedResults(AuditLog, filter, {
    page,
    limit,
    sort: { createdAt: -1 },
    populate: [{ path: 'actor', select: 'name username profilePicture' }]
  });
};

// ─── REPORTS MODERATION ──────────────────────────────────────────────────────
export const getReports = async (query) => {
  const { page = 1, limit = 20, status } = query;
  const filter = {};
  if (status) filter.status = status;

  return getPaginatedResults(Report, filter, {
    page,
    limit,
    sort: { createdAt: -1 },
    populate: [
      { path: 'reporter', select: 'name username profilePicture' },
      { path: 'reportedUser', select: 'name username profilePicture' }
    ]
  });
};

export const updateReportStatus = async (reportId, status, adminId) => {
  if (!['Pending', 'Reviewing', 'Resolved', 'Dismissed'].includes(status)) {
    throw new ApiError(400, 'Invalid status');
  }

  const report = await Report.findById(reportId);
  if (!report) throw new ApiError(404, 'Report not found');

  report.status = status;
  await report.save();

  await AuditLog.create({
    action: 'REPORT_STATUS_UPDATED',
    actor: adminId,
    target: report._id,
    targetModel: 'Report',
    details: { status }
  });

  return report;
};

// ─── COMMUNITY MODERATION ───────────────────────────────────────────────────
export const getCommunityPosts = async (query) => {
  const { page = 1, limit = 20, search } = query;
  const filter = {};
  
  if (search) {
    filter.caption = { $regex: search, $options: 'i' };
  }

  return getPaginatedResults(Post, filter, {
    page,
    limit,
    sort: { createdAt: -1 },
    populate: [{ path: 'author', select: 'name username profilePicture' }]
  });
};

export const deleteCommunityPost = async (postId, adminId) => {
  const post = await Post.findByIdAndDelete(postId);
  if (!post) throw new ApiError(404, 'Post not found');

  // Background Cloudinary cleanup
  if (post.images && post.images.length > 0) {
    post.images.forEach(imgUrl => {
      try {
        const parts = imgUrl.split('/upload/');
        if (parts.length === 2) {
          const pathWithoutVersion = parts[1].replace(/^v\d+\//, '');
          const publicId = pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf('.')) || pathWithoutVersion;
          if (publicId) {
            cloudinary.uploader.destroy(publicId).catch(err => console.error('Cloudinary delete error:', err));
          }
        }
      } catch (err) {
        console.error('Error parsing Cloudinary URL:', err);
      }
    });
  }

  await AuditLog.create({
    action: 'POST_DELETED',
    actor: adminId,
    target: postId,
    targetModel: 'Post',
    details: { postCaption: post.caption }
  });

  return { id: postId };
};

// ─── MESSAGES MODERATION ────────────────────────────────────────────────────
export const getMessages = async (query) => {
  const { page = 1, limit = 20 } = query;
  
  return getPaginatedResults(Message, {}, {
    page,
    limit,
    sort: { createdAt: -1 },
    populate: [
      { path: 'sender', select: 'name username' },
      { path: 'conversation', select: 'participants' }
    ]
  });
};

export const deleteMessage = async (messageId, adminId) => {
  const msg = await Message.findByIdAndDelete(messageId);
  if (!msg) throw new ApiError(404, 'Message not found');

  await AuditLog.create({
    action: 'MESSAGE_DELETED',
    actor: adminId,
    target: messageId,
    targetModel: 'Message',
    details: { messageContent: msg.content }
  });

  return { id: messageId };
};
