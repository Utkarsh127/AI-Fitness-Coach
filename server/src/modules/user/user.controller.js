/**
 * @module modules/user/user.controller
 * @description Request handlers for user profiles.
 */

import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import * as userService from './user.service.js';

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getProfile(req.user._id);
  res.status(200).json(new ApiResponse(200, profile, 'Profile fetched successfully'));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await userService.updateProfile(req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, profile, 'Profile updated successfully'));
});

export const submitOnboarding = asyncHandler(async (req, res) => {
  const profile = await userService.completeOnboarding(req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, profile, 'Onboarding completed successfully'));
});

export const getOnboardingStatus = asyncHandler(async (req, res) => {
  const status = await userService.getOnboardingStatus(req.user._id);
  res.status(200).json(new ApiResponse(200, status, 'Onboarding status fetched'));
});

export const uploadProfilePicture = asyncHandler(async (req, res) => {
  const profile = await userService.updateProfilePicture(req.user._id, req.file);
  res.status(200).json(new ApiResponse(200, profile, 'Profile picture updated successfully'));
});

export const searchUsers = asyncHandler(async (req, res) => {
  const users = await userService.searchUsers(req.user._id, req.query.q || '');
  res.status(200).json(new ApiResponse(200, users, 'Users fetched'));
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  res.status(200).json(new ApiResponse(200, user, 'User fetched'));
});
