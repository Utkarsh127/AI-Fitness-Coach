/**
 * @module api/messaging.api
 * @description API calls for Messaging.
 */

import axiosInstance from './axiosInstance.js';

export const getConversations = (params) => axiosInstance.get('/messages/conversations', { params });

export const createConversation = (data) => axiosInstance.post('/messages/conversations', data);

export const getMessages = (conversationId, params) => axiosInstance.get(`/messages/${conversationId}`, { params });

// Let Axios auto-detect FormData and add the correct multipart boundary
export const sendMessage = (formData) => axiosInstance.post('/messages', formData);

export const deleteMessageForMe = (id) => axiosInstance.delete(`/messages/${id}/for-me`);

export const deleteMessageForEveryone = (id) => axiosInstance.delete(`/messages/${id}/for-everyone`);
