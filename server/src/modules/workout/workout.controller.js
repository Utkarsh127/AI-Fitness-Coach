/**
 * @module modules/workout/workout.controller
 * @description Controllers for Workout Plans, Logs, and PRs.
 */

import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import * as workoutService from './workout.service.js';

// ─── Workout Plans ─────────────────────────────────────────────────────────────

export const getWorkoutPlans = asyncHandler(async (req, res) => {
  const result = await workoutService.getWorkoutPlans(req.user._id, req.query);
  res.status(200).json(new ApiResponse(200, result, 'Workout plans fetched successfully'));
});

export const getWorkoutPlanById = asyncHandler(async (req, res) => {
  const plan = await workoutService.getWorkoutPlanById(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, plan, 'Workout plan fetched successfully'));
});

export const createWorkoutPlan = asyncHandler(async (req, res) => {
  const plan = await workoutService.createWorkoutPlan(req.user._id, req.body);
  res.status(201).json(new ApiResponse(201, plan, 'Workout plan created successfully'));
});

export const updateWorkoutPlan = asyncHandler(async (req, res) => {
  const plan = await workoutService.updateWorkoutPlan(req.params.id, req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, plan, 'Workout plan updated successfully'));
});

export const deleteWorkoutPlan = asyncHandler(async (req, res) => {
  await workoutService.deleteWorkoutPlan(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, null, 'Workout plan deleted successfully'));
});

// ─── Workout Logs & Stats ──────────────────────────────────────────────────────

export const logWorkout = asyncHandler(async (req, res) => {
  const result = await workoutService.logWorkout(req.user._id, req.body);
  res.status(201).json(new ApiResponse(201, result, 'Workout logged successfully'));
});

export const getWorkoutHistory = asyncHandler(async (req, res) => {
  const result = await workoutService.getWorkoutHistory(req.user._id, req.query);
  res.status(200).json(new ApiResponse(200, result, 'Workout history fetched'));
});

export const getWorkoutStats = asyncHandler(async (req, res) => {
  const stats = await workoutService.getWorkoutStats(req.user._id);
  res.status(200).json(new ApiResponse(200, stats, 'Workout stats fetched'));
});

export const getPersonalRecords = asyncHandler(async (req, res) => {
  const prs = await workoutService.getPersonalRecords(req.user._id);
  res.status(200).json(new ApiResponse(200, prs, 'Personal records fetched'));
});
