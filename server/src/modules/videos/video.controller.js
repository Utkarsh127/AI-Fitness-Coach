/**
 * @module modules/videos/video.controller
 * @description Controllers for YouTube fitness videos.
 */

import * as youtubeService from '../../services/youtube.service.js';
import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';

/**
 * @route   GET /api/v1/videos/search
 * @desc    Search fitness videos or get the default feed
 * @access  Private
 */
export const searchVideos = asyncHandler(async (req, res) => {
  const { q, pageToken, maxResults = 20 } = req.query;

  // Search fitness videos. If q is empty, service provides a default fitness query.
  const data = await youtubeService.searchFitnessVideos({ 
    q: q || '', 
    pageToken, 
    maxResults: parseInt(maxResults, 10) 
  });

  return res.status(200).json(
    new ApiResponse(200, data, 'Videos fetched successfully')
  );
});

/**
 * @route   GET /api/v1/videos/:videoId
 * @desc    Get video details by YouTube ID
 * @access  Private
 */
export const getVideoDetails = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const data = await youtubeService.getVideoDetails(videoId);

  return res.status(200).json(
    new ApiResponse(200, data, 'Video details fetched successfully')
  );
});
