/**
 * @module api/learning.api
 * @description API calls for Fitness Learning Hub.
 */

import axiosInstance from './axiosInstance.js';

export const getVideos = (params) => axiosInstance.get('/learning/videos', { params });
export const getVideoById = (id) => axiosInstance.get(`/learning/videos/${id}`);

export const getRoadmaps = () => axiosInstance.get('/learning/roadmaps');
export const getRoadmapById = (id) => axiosInstance.get(`/learning/roadmaps/${id}`);

export const getUserLibrary = () => axiosInstance.get('/learning/library');
export const toggleFavorite = (id) => axiosInstance.post(`/learning/favorites/${id}`);
export const toggleWatchLater = (id) => axiosInstance.post(`/learning/watch-later/${id}`);
export const clearHistory = () => axiosInstance.delete('/learning/history/clear');
