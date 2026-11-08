/**
 * @module api/workout.api
 * @description API calls for Workout Plans, Logs, and PRs.
 */

import axiosInstance from './axiosInstance.js';

// Plans
export const getWorkoutPlans = (params) => axiosInstance.get('/workouts/plans', { params });
export const getWorkoutPlanById = (id) => axiosInstance.get(`/workouts/plans/${id}`);
export const createWorkoutPlan = (data) => axiosInstance.post('/workouts/plans', data);
export const updateWorkoutPlan = (id, data) => axiosInstance.put(`/workouts/plans/${id}`, data);
export const deleteWorkoutPlan = (id) => axiosInstance.delete(`/workouts/plans/${id}`);

// Logs & History
export const logWorkout = (data) => axiosInstance.post('/workouts/logs', data);
export const getWorkoutHistory = (params) => axiosInstance.get('/workouts/history', { params });

// Stats & PRs
export const getWorkoutStats = () => axiosInstance.get('/workouts/stats');
export const getPersonalRecords = () => axiosInstance.get('/workouts/prs');
