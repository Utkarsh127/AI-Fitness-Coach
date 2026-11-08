/**
 * @module api/exercise.api
 * @description API calls for the Exercise Library.
 */

import axiosInstance from './axiosInstance.js';

export const getExercises = (params) => axiosInstance.get('/exercises', { params });
export const getExerciseById = (id) => axiosInstance.get(`/exercises/${id}`);
export const getExerciseBySlug = (slug) => axiosInstance.get(`/exercises/slug/${slug}`);
