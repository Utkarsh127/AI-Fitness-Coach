/**
 * @module api/community.api
 * @description API calls for Community System.
 */

import axiosInstance from './axiosInstance.js';

// Posts & Feed
export const getFeed = (params) => axiosInstance.get('/community/posts', { params });
export const getPostById = (id) => axiosInstance.get(`/community/posts/${id}`);
export const createPost = (formData) => axiosInstance.post('/community/posts', formData);
export const updatePost = (id, data) => axiosInstance.put(`/community/posts/${id}`, data);
export const deletePost = (id) => axiosInstance.delete(`/community/posts/${id}`);

// Interactions
export const toggleLike = (id) => axiosInstance.post(`/community/posts/${id}/like`);
export const toggleBookmark = (id) => axiosInstance.post(`/community/posts/${id}/bookmark`);
export const getSavedPosts = (params) => axiosInstance.get('/community/saved', { params });
export const getUserPosts = (userId, params) => axiosInstance.get(`/community/user/${userId}`, { params });

// Comments
export const getComments = (postId) => axiosInstance.get(`/community/posts/${postId}/comments`);
export const addComment = (postId, data) => axiosInstance.post(`/community/posts/${postId}/comments`, data);
export const deleteComment = (commentId) => axiosInstance.delete(`/community/comments/${commentId}`);
