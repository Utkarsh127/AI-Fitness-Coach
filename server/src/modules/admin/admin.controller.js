/**
 * @module modules/admin/admin.controller
 * @description Controllers for Admin user management.
 */

import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import * as adminService from './admin.service.js';

export const getUsers = asyncHandler(async (req, res) => {
  const result = await adminService.getUsers(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Users fetched successfully'));
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await adminService.getUserById(req.params.id);
  res.status(200).json(new ApiResponse(200, user, 'User fetched successfully'));
});

export const createUser = asyncHandler(async (req, res) => {
  const user = await adminService.createUser(req.body);
  res.status(201).json(new ApiResponse(201, user, 'User created successfully'));
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await adminService.updateUser(req.user._id, req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, user, 'User updated successfully'));
});

export const deactivateUser = asyncHandler(async (req, res) => {
  const result = await adminService.deactivateUser(req.user._id, req.params.id);
  res.status(200).json(new ApiResponse(200, result, 'User deactivated successfully'));
});

// ─── ADMIN STATS ─────────────────────────────────────────────────────────────
export const getStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getAdminStats();
  res.status(200).json(new ApiResponse(200, stats, 'Admin stats fetched successfully'));
});

// ─── AUDIT LOGS ─────────────────────────────────────────────────────────────
export const getAuditLogs = asyncHandler(async (req, res) => {
  const logs = await adminService.getAuditLogs(req.query);
  res.status(200).json(new ApiResponse(200, logs, 'Audit logs fetched successfully'));
});

// ─── REPORTS ─────────────────────────────────────────────────────────────────
export const getReports = asyncHandler(async (req, res) => {
  const reports = await adminService.getReports(req.query);
  res.status(200).json(new ApiResponse(200, reports, 'Reports fetched successfully'));
});

export const updateReportStatus = asyncHandler(async (req, res) => {
  const report = await adminService.updateReportStatus(req.params.id, req.body.status, req.user._id);
  res.status(200).json(new ApiResponse(200, report, 'Report status updated'));
});

// ─── COMMUNITY MODERATION ───────────────────────────────────────────────────
export const getCommunityPosts = asyncHandler(async (req, res) => {
  const posts = await adminService.getCommunityPosts(req.query);
  res.status(200).json(new ApiResponse(200, posts, 'Posts fetched successfully'));
});

export const deleteCommunityPost = asyncHandler(async (req, res) => {
  const result = await adminService.deleteCommunityPost(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, result, 'Post deleted by admin'));
});

// ─── MESSAGES MODERATION ────────────────────────────────────────────────────
export const getMessages = asyncHandler(async (req, res) => {
  const messages = await adminService.getMessages(req.query);
  res.status(200).json(new ApiResponse(200, messages, 'Messages fetched successfully'));
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const result = await adminService.deleteMessage(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, result, 'Message deleted by admin'));
});
