/**
 * @module api/ai.api
 * @description Axios API requests for the AI Coach feature.
 */

import axiosInstance from './axiosInstance.js';

const API_URL = '/ai';

export const testAi = (message) => axiosInstance.post(`${API_URL}/test`, { message });

export const getConversations = () => axiosInstance.get(`${API_URL}/conversations`);

export const createConversation = (title) => axiosInstance.post(`${API_URL}/conversations`, { title });

export const getConversationById = (id) => axiosInstance.get(`${API_URL}/conversations/${id}`);

export const deleteConversation = (id) => axiosInstance.delete(`${API_URL}/conversations/${id}`);

export const sendMessage = (conversationId, message) => 
  axiosInstance.post(`${API_URL}/conversations/${conversationId}/messages`, { message });

export const generateWorkout = (preferences) => axiosInstance.post(`${API_URL}/workouts/generate`, preferences);
