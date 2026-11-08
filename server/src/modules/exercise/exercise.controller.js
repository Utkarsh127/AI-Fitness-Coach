/**
 * @module modules/exercise/exercise.controller
 * @description Controllers for the Exercise Library.
 */

import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import * as exerciseService from './exercise.service.js';

export const getExercises = asyncHandler(async (req, res) => {
  const result = await exerciseService.getExercises(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Exercises fetched successfully'));
});

export const getExerciseById = asyncHandler(async (req, res) => {
  const exercise = await exerciseService.getExerciseById(req.params.id);
  res.status(200).json(new ApiResponse(200, exercise, 'Exercise fetched successfully'));
});

export const getExerciseBySlug = asyncHandler(async (req, res) => {
  const exercise = await exerciseService.getExerciseBySlug(req.params.slug);
  res.status(200).json(new ApiResponse(200, exercise, 'Exercise fetched successfully'));
});

export const createExercise = asyncHandler(async (req, res) => {
  const exercise = await exerciseService.createExercise(req.body);
  res.status(201).json(new ApiResponse(201, exercise, 'Exercise created successfully'));
});

export const updateExercise = asyncHandler(async (req, res) => {
  const exercise = await exerciseService.updateExercise(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, exercise, 'Exercise updated successfully'));
});

export const deleteExercise = asyncHandler(async (req, res) => {
  await exerciseService.deleteExercise(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Exercise deleted successfully'));
});
