/**
 * @module api/user.api
 * @description Axios calls for user profile endpoints.
 */

import axiosInstance from './axiosInstance.js';

export const getProfile = () =>
  axiosInstance.get('/users/me/profile');

export const updateProfile = (data) =>
  axiosInstance.put('/users/me/profile', data);

export const submitOnboarding = (data) =>
  axiosInstance.post('/users/me/onboarding', data);

export const getOnboardingStatus = () =>
  axiosInstance.get('/users/me/onboarding-status');

export const uploadProfilePicture = (formData) =>
  axiosInstance.post('/users/me/profile-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const searchUsers = (q = '') =>
  axiosInstance.get('/users/search', { params: { q } });

export const getUserById = (userId) =>
  axiosInstance.get(`/users/${userId}/profile`);
