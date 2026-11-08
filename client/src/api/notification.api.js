/**
 * @module api/notification.api
 * @description API calls for Notifications.
 */

import axiosInstance from './axiosInstance.js';

export const getNotifications = (params) => axiosInstance.get('/notifications', { params });
export const getUnreadCount = () => axiosInstance.get('/notifications/count');
export const markAsRead = (id) => axiosInstance.patch(`/notifications/${id}/read`);
export const markAllAsRead = () => axiosInstance.patch('/notifications/read-all');
export const deleteNotification = (id) => axiosInstance.delete(`/notifications/${id}`);
export const clearAllNotifications = () => axiosInstance.delete('/notifications/clear');
