/**
 * @module modules/shorts/shorts.controller
 * @description Controllers for the Fitness Shorts API.
 */

import { fetchFitnessShorts, fetchShortDetails } from './shorts.service.js';
import asyncHandler from '../../utils/asyncHandler.js';

/**
 * @desc Get fitness shorts list from YouTube
 * @route GET /api/v1/shorts
 * @access Private
 */
export const getShorts = asyncHandler(async (req, res) => {
  const { category, skill, difficulty, pageToken } = req.query;

  const result = await fetchFitnessShorts({ category, skill, difficulty, pageToken });

  res.status(200).json({
    success: true,
    data: result.shorts,
    nextPageToken: result.nextPageToken,
    prevPageToken: result.prevPageToken
  });
});

/**
 * @desc Get single short details
 * @route GET /api/v1/shorts/:id
 * @access Private
 */
export const getShortById = asyncHandler(async (req, res) => {
  const shortDetails = await fetchShortDetails(req.params.id);

  res.status(200).json({
    success: true,
    data: shortDetails
  });
});
