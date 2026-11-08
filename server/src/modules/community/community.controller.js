/**
 * @module modules/community/community.controller
 * @description Controllers for the Community System.
 */

import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import * as communityService from './community.service.js';

export const getFeed = asyncHandler(async (req, res) => {
  const result = await communityService.getFeed(req.user._id, req.query);
  res.status(200).json(new ApiResponse(200, result, 'Feed fetched successfully'));
});

export const getPostById = asyncHandler(async (req, res) => {
  const post = await communityService.getPostById(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, post, 'Post fetched successfully'));
});

export const createPost = asyncHandler(async (req, res) => {
  const post = await communityService.createPost(req.user._id, req.body, req.files);
  res.status(201).json(new ApiResponse(201, post, 'Post created successfully'));
});

export const updatePost = asyncHandler(async (req, res) => {
  const post = await communityService.updatePost(req.params.id, req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, post, 'Post updated successfully'));
});

export const deletePost = asyncHandler(async (req, res) => {
  await communityService.deletePost(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, null, 'Post deleted successfully'));
});

export const toggleLikePost = asyncHandler(async (req, res) => {
  const likes = await communityService.toggleLikePost(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, likes, 'Post like toggled'));
});

export const toggleBookmarkPost = asyncHandler(async (req, res) => {
  const bookmarks = await communityService.toggleBookmarkPost(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, bookmarks, 'Post bookmark toggled'));
});

export const getSavedPosts = asyncHandler(async (req, res) => {
  const result = await communityService.getSavedPosts(req.user._id, req.query);
  res.status(200).json(new ApiResponse(200, result, 'Saved posts fetched'));
});

export const getUserPosts = asyncHandler(async (req, res) => {
  const result = await communityService.getUserPosts(req.params.userId, req.query);
  res.status(200).json(new ApiResponse(200, result, 'User posts fetched'));
});

// Comments
export const getComments = asyncHandler(async (req, res) => {
  const comments = await communityService.getCommentsForPost(req.params.id);
  res.status(200).json(new ApiResponse(200, comments, 'Comments fetched'));
});

export const addComment = asyncHandler(async (req, res) => {
  const comment = await communityService.addComment(req.params.id, req.user._id, req.body);
  res.status(201).json(new ApiResponse(201, comment, 'Comment added successfully'));
});

export const deleteComment = asyncHandler(async (req, res) => {
  await communityService.deleteComment(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, null, 'Comment deleted successfully'));
});
