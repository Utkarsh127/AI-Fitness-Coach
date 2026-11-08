/**
 * @module services/youtube.service
 * @description Handles interaction with the YouTube Data API v3.
 */

import logger from '../config/logger.js';
import ApiError from '../utils/ApiError.js';
import Video from '../models/video.model.js';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

/**
 * Normalizes YouTube API error responses into application ApiError.
 */
const handleYouTubeError = async (response) => {
  if (response.ok) return;

  const errorData = await response.json().catch(() => ({}));
  const status = response.status;
  const message = errorData?.error?.message || 'YouTube API error';
  
  logger.error('[VIDEOS] YouTube API request failed:', {
    status,
    message,
    reason: errorData?.error?.errors?.[0]?.reason || 'unknown',
    rawError: errorData
  });

  if (status === 403 && (message.toLowerCase().includes('quota') || errorData?.error?.errors?.[0]?.reason === 'quotaExceeded')) {
    throw new ApiError(429, 'YouTube API quota exceeded (YOUTUBE_QUOTA_EXCEEDED)');
  }
  
  if (status === 400 && message.toLowerCase().includes('key')) {
    throw new ApiError(500, 'Invalid YouTube API key configuration');
  }

  // Return a stable 503 so frontend can handle it cleanly
  throw new ApiError(503, 'Fitness Videos are temporarily unavailable.', 'YOUTUBE_API_UNAVAILABLE');
};

/**
 * Get the API key securely from environment.
 */
const getApiKey = () => {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key || key === 'your_youtube_api_key' || key === 'your_youtube_api_key_here') {
    logger.error('YouTube API key is missing or invalid in configuration.');
    throw new ApiError(500, 'YouTube service is not configured (YOUTUBE_NOT_CONFIGURED)');
  }
  return key;
};

/**
 * Parses ISO 8601 duration string (e.g. PT10M30S) into seconds
 */
const parseISODuration = (durationStr) => {
  if (!durationStr) return 0;
  const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = (parseInt(match[1]) || 0) * 3600;
  const minutes = (parseInt(match[2]) || 0) * 60;
  const seconds = (parseInt(match[3]) || 0);
  return hours + minutes + seconds;
};

/**
 * Maps search query to standard category
 */
const getCategoryFromQuery = (q) => {
  if (!q) return 'General';
  const query = q.toLowerCase();
  const categories = [
    'Handstand', 'Handstand Push-Up', 'Planche', 'Front Lever', 'Back Lever',
    'Muscle Up', 'Pull Ups', 'Dips', 'Push Ups', 'Core', 'Mobility', 
    'Stretching', 'Recovery', 'Nutrition', 'Strength', 'Hypertrophy', 
    'Fat Loss', 'Hybrid Training', 'Cardio'
  ];
  for (const cat of categories) {
    if (query.includes(cat.toLowerCase())) return cat;
  }
  return 'General';
};

/**
 * Searches for fitness videos, prioritizing MongoDB cache.
 * @param {Object} params - Query parameters.
 * @param {string} params.q - Search term.
 * @param {string} [params.pageToken] - Token for pagination.
 * @param {number} [params.maxResults=20] - Number of results to return.
 * @returns {Promise<Object>} Normalized search results.
 */
export const searchFitnessVideos = async ({ q, pageToken, maxResults = 20 }) => {
  // 1. Try Cache First (If not paginating)
  if (!pageToken && q) {
    try {
      const cachedVideos = await Video.find(
        { $text: { $search: q } },
        { score: { $meta: 'textScore' } }
      )
      .sort({ score: { $meta: 'textScore' } })
      .limit(maxResults);

      if (cachedVideos.length >= 5) {
        logger.info(`YouTube Cache Hit for "${q}": Found ${cachedVideos.length} videos`);
        
        // Map to expected format
        const normalizedCache = cachedVideos.map(v => ({
          videoId: v.youtubeVideoId,
          title: v.title,
          description: v.description,
          thumbnail: v.thumbnail,
          channelTitle: v.channelName,
          duration: `PT${v.duration}S`, // Re-mock ISO string for frontend if needed, though frontend should be adapted
          durationSeconds: v.duration,
          url: `https://www.youtube.com/watch?v=${v.youtubeVideoId}`,
        }));

        return { videos: normalizedCache, nextPageToken: null, prevPageToken: null, pageInfo: { totalResults: cachedVideos.length } };
      }
    } catch (err) {
      logger.error('Error reading from Video cache', err);
    }
  }

  // 2. Fetch from YouTube
  let apiKey;
  try {
    apiKey = getApiKey();
  } catch(err) {
    // If API key fails and we have ANY cached results, return them instead of crashing
    if (q) {
      const fallback = await Video.find({ $text: { $search: q } }).limit(maxResults);
      if (fallback.length > 0) {
        return { videos: fallback.map(v => ({ videoId: v.youtubeVideoId, title: v.title, thumbnail: v.thumbnail, url: `https://www.youtube.com/watch?v=${v.youtubeVideoId}`}))};
      }
    }
    throw err;
  }
  
  // Enforce fitness context on search terms if the user provides one
  // We append fitness context to make sure the results are relevant.
  const searchQuery = q ? `${q} fitness workout` : 'fitness workout strength calisthenics mobility';

  const url = new URL(`${YOUTUBE_API_BASE}/search`);
  url.searchParams.append('part', 'snippet');
  url.searchParams.append('q', searchQuery);
  url.searchParams.append('type', 'video');
  url.searchParams.append('videoEmbeddable', 'true');
  url.searchParams.append('maxResults', maxResults.toString());
  url.searchParams.append('key', apiKey);
  url.searchParams.append('relevanceLanguage', 'en');
  if (pageToken) url.searchParams.append('pageToken', pageToken);

  const response = await fetch(url.toString(), { method: 'GET' });
  await handleYouTubeError(response);
  
  const data = await response.json();

  // YouTube /search does not return video duration. We need to fetch it from /videos
  const videoIds = data.items.map((item) => item.id.videoId);
  
  let videoDetails = [];
  if (videoIds.length > 0) {
    videoDetails = await getVideosMetadata(videoIds);
  }

  // Merge snippet and details
  const normalizedVideos = data.items.map((item) => {
    const details = videoDetails.find((v) => v.id === item.id.videoId);
    const durationStr = details?.contentDetails?.duration || 'PT0M0S';
    return {
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      duration: durationStr,
      durationSeconds: parseISODuration(durationStr),
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    };
  });

  // 3. Save to MongoDB Cache
  if (normalizedVideos.length > 0) {
    const category = getCategoryFromQuery(q);
    const docs = normalizedVideos.map(v => ({
      title: v.title,
      description: v.description,
      youtubeVideoId: v.videoId,
      thumbnail: v.thumbnail,
      duration: v.durationSeconds,
      channelName: v.channelTitle,
      category,
      tags: [category.toLowerCase()],
    }));
    
    try {
      await Video.insertMany(docs, { ordered: false });
    } catch (err) {
      // Ignore duplicate key errors (11000)
    }
  }

  return {
    videos: normalizedVideos,
    nextPageToken: data.nextPageToken,
    prevPageToken: data.prevPageToken,
    pageInfo: data.pageInfo,
  };
};

/**
 * Fetches specific metadata for a list of video IDs.
 * @param {string[]} videoIds - Array of YouTube video IDs.
 * @returns {Promise<Array>} Array of video details objects.
 */
const getVideosMetadata = async (videoIds) => {
  const apiKey = getApiKey();
  
  const url = new URL(`${YOUTUBE_API_BASE}/videos`);
  url.searchParams.append('part', 'snippet,contentDetails');
  url.searchParams.append('id', videoIds.join(','));
  url.searchParams.append('key', apiKey);

  const response = await fetch(url.toString(), { method: 'GET' });
  await handleYouTubeError(response);

  const data = await response.json();
  return data.items || [];
};

/**
 * Fetches details for a single video.
 * @param {string} videoId - The YouTube video ID.
 * @returns {Promise<Object>} Normalized video detail object.
 */
export const getVideoDetails = async (videoId) => {
  if (!videoId) throw new ApiError(400, 'Video ID is required');
  
  const detailsArray = await getVideosMetadata([videoId]);
  if (detailsArray.length === 0) {
    throw new ApiError(404, 'Video not found');
  }

  const item = detailsArray[0];
  
  return {
    videoId: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    duration: item.contentDetails.duration,
    tags: item.snippet.tags || [],
    url: `https://www.youtube.com/watch?v=${item.id}`,
  };
};
