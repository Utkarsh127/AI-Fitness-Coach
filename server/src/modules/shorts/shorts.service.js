/**
 * @module modules/shorts/shorts.service
 * @description Handles fetching YouTube Shorts tailored for fitness context.
 */

import logger from '../../config/logger.js';
import ApiError from '../../utils/ApiError.js';
import { getVideoDetails } from '../../services/youtube.service.js';

// Simple in-memory cache to avoid unnecessary API calls
const shortsCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

const getApiKey = () => {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key || key === 'your_youtube_api_key' || key === 'your_youtube_api_key_here') {
    logger.error('YouTube API key is missing or invalid in configuration.');
    throw new ApiError(500, 'YouTube service is not configured (YOUTUBE_NOT_CONFIGURED)');
  }
  return key;
};

const handleYouTubeError = async (response) => {
  if (response.ok) return;
  const errorData = await response.json().catch(() => ({}));
  const status = response.status;
  const message = errorData?.error?.message || 'YouTube API error';
  
  logger.error('[SHORTS] YouTube API request failed:', {
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
  throw new ApiError(503, 'Fitness Shorts are temporarily unavailable.', 'YOUTUBE_API_UNAVAILABLE');
};

const parseISODuration = (durationStr) => {
  if (!durationStr) return 0;
  const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = (parseInt(match[1]) || 0) * 3600;
  const minutes = (parseInt(match[2]) || 0) * 60;
  const seconds = (parseInt(match[3]) || 0);
  return hours + minutes + seconds;
};

export const fetchFitnessShorts = async (filters) => {
  const { category, skill, difficulty, pageToken } = filters;
  
  const cacheKey = `shorts_${category || 'all'}_${skill || 'all'}_${difficulty || 'all'}_${pageToken || 'first'}`;
  const cachedResponse = shortsCache.get(cacheKey);
  
  if (cachedResponse && (Date.now() - cachedResponse.timestamp) < CACHE_TTL_MS) {
    logger.info(`Cache Hit for Shorts: ${cacheKey}`);
    return cachedResponse.data;
  }

  const apiKey = getApiKey();
  
  // Construct a heavily fitness-biased search query
  let queryParts = [];
  if (skill && skill !== 'ALL') queryParts.push(skill.toLowerCase());
  if (category && category !== 'ALL' && category !== 'SKILLS') queryParts.push(category.toLowerCase());
  if (difficulty && difficulty !== 'ALL') queryParts.push(difficulty.toLowerCase());
  
  // Base fitness context + "shorts" to bias YT algorithm
  const baseContext = queryParts.length > 0 ? 'calisthenics fitness shorts' : 'calisthenics fitness workout shorts';
  const finalQuery = `${queryParts.join(' ')} ${baseContext}`.trim();

  logger.info(`Fetching YouTube Shorts with query: "${finalQuery}"`);

  const url = new URL(`${YOUTUBE_API_BASE}/search`);
  url.searchParams.append('part', 'snippet');
  url.searchParams.append('q', finalQuery);
  url.searchParams.append('type', 'video');
  url.searchParams.append('videoEmbeddable', 'true');
  url.searchParams.append('videoDuration', 'short'); // Key param: only videos < 4 minutes
  url.searchParams.append('maxResults', '10'); // Fetch 10 to conserve quota
  url.searchParams.append('key', apiKey);
  url.searchParams.append('relevanceLanguage', 'en');
  if (pageToken) url.searchParams.append('pageToken', pageToken);

  const response = await fetch(url.toString(), { method: 'GET' });
  await handleYouTubeError(response);
  
  const data = await response.json();
  const videoIds = data.items.map((item) => item.id.videoId);
  
  // Need duration from /videos to ensure it's not actually a live stream or weird format
  let videoDetails = [];
  if (videoIds.length > 0) {
    const detailsUrl = new URL(`${YOUTUBE_API_BASE}/videos`);
    detailsUrl.searchParams.append('part', 'snippet,contentDetails');
    detailsUrl.searchParams.append('id', videoIds.join(','));
    detailsUrl.searchParams.append('key', apiKey);

    const detailsResponse = await fetch(detailsUrl.toString(), { method: 'GET' });
    if (detailsResponse.ok) {
        const detailsData = await detailsResponse.json();
        videoDetails = detailsData.items || [];
    }
  }

  const normalizedVideos = data.items.map((item) => {
    const details = videoDetails.find((v) => v.id === item.id.videoId);
    const durationStr = details?.contentDetails?.duration || 'PT0M0S';
    return {
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
      channelTitle: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      publishedAt: item.snippet.publishedAt,
      durationSeconds: parseISODuration(durationStr),
      source: "youtube",
      youtubeUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      embedUrl: `https://www.youtube.com/embed/${item.id.videoId}?autoplay=1&mute=0&loop=1&playlist=${item.id.videoId}`
    };
  });

  const result = {
    shorts: normalizedVideos,
    nextPageToken: data.nextPageToken,
    prevPageToken: data.prevPageToken,
  };

  shortsCache.set(cacheKey, { data: result, timestamp: Date.now() });
  return result;
};

export const fetchShortDetails = async (id) => {
  if (!id) throw new ApiError(400, 'Short ID is required');
  
  const cacheKey = `short_detail_${id}`;
  const cachedResponse = shortsCache.get(cacheKey);
  if (cachedResponse && (Date.now() - cachedResponse.timestamp) < CACHE_TTL_MS) {
    return cachedResponse.data;
  }
  
  const rawDetails = await getVideoDetails(id);
  const normalized = {
    id: rawDetails.videoId,
    title: rawDetails.title,
    description: rawDetails.description,
    thumbnailUrl: rawDetails.thumbnail,
    channelTitle: rawDetails.channelTitle,
    publishedAt: rawDetails.publishedAt,
    durationSeconds: parseISODuration(rawDetails.duration),
    tags: rawDetails.tags,
    source: "youtube",
    youtubeUrl: rawDetails.url,
    embedUrl: `https://www.youtube.com/embed/${rawDetails.videoId}?autoplay=1&mute=0`
  };
  
  shortsCache.set(cacheKey, { data: normalized, timestamp: Date.now() });
  return normalized;
};
