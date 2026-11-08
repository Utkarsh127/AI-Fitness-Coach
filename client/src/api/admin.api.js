/**
 * @module api/admin.api
 * @description Axios API calls for Admin management
 */

import axios from './axiosInstance.js';

export const getUsers = (params) => axios.get('/admin/users', { params });
export const getUser = (id) => axios.get(`/admin/users/${id}`);
export const createUser = (data) => axios.post('/admin/users', data);
export const updateUser = (id, data) => axios.patch(`/admin/users/${id}`, data);
export const deactivateUser = (id) => axios.delete(`/admin/users/${id}`);

// ─── Stats ───────────────────────────────────────────────────────────────────
export const getStats = () => axios.get('/admin/stats');

// ─── Reports ─────────────────────────────────────────────────────────────────
export const getReports = (params) => axios.get('/admin/reports', { params });
export const updateReportStatus = (id, status) => axios.patch(`/admin/reports/${id}/status`, { status });
export const submitReport = (data) => axios.post('/reports', data);

// ─── Audit Logs ──────────────────────────────────────────────────────────────
export const getAuditLogs = (params) => axios.get('/admin/logs', { params });

// ─── Community Moderation ────────────────────────────────────────────────────
export const getCommunityPosts = (params) => axios.get('/admin/posts', { params });
export const deleteCommunityPost = (id) => axios.delete(`/admin/posts/${id}`);

// ─── Messages Moderation ─────────────────────────────────────────────────────
export const getMessages = (params) => axios.get('/admin/messages', { params });
export const deleteMessage = (id) => axios.delete(`/admin/messages/${id}`);
