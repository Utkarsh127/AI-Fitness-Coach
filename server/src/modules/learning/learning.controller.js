/**
 * @module modules/learning/learning.controller
 * @description Controllers for the Fitness Learning Hub.
 */

import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import * as learningService from './learning.service.js';

export const getVideos = asyncHandler(async (req, res) => {
  const result = await learningService.getVideos(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Videos fetched successfully'));
});

export const getVideoById = asyncHandler(async (req, res) => {
  const video = await learningService.getVideoById(req.user._id, req.params.id);
  const related = await learningService.getRelatedVideos(req.params.id);
  res.status(200).json(new ApiResponse(200, { video, related }, 'Video details fetched successfully'));
});

export const getRoadmaps = asyncHandler(async (req, res) => {
  const roadmaps = await learningService.getRoadmaps();
  res.status(200).json(new ApiResponse(200, roadmaps, 'Roadmaps fetched successfully'));
});

export const getRoadmapById = asyncHandler(async (req, res) => {
  const roadmap = await learningService.getRoadmapById(req.params.id);
  res.status(200).json(new ApiResponse(200, roadmap, 'Roadmap details fetched successfully'));
});

export const getUserLibrary = asyncHandler(async (req, res) => {
  const library = await learningService.getUserLibrary(req.user._id);
  res.status(200).json(new ApiResponse(200, library, 'User library fetched successfully'));
});

export const toggleFavorite = asyncHandler(async (req, res) => {
  const result = await learningService.toggleFavorite(req.user._id, req.params.id);
  res.status(200).json(new ApiResponse(200, result, 'Favorite toggled successfully'));
});

export const toggleWatchLater = asyncHandler(async (req, res) => {
  const result = await learningService.toggleWatchLater(req.user._id, req.params.id);
  res.status(200).json(new ApiResponse(200, result, 'Watch Later toggled successfully'));
});

export const clearHistory = asyncHandler(async (req, res) => {
  const result = await learningService.clearHistory(req.user._id);
  res.status(200).json(new ApiResponse(200, result, 'History cleared successfully'));
});
