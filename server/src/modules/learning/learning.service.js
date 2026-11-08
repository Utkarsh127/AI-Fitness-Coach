/**
 * @module modules/learning/learning.service
 * @description Business logic for the Fitness Learning Hub.
 */

import Video from '../../models/video.model.js';
import UserVideoMeta from '../../models/userVideoMeta.model.js';
import { getPaginatedResults } from '../../utils/pagination.js';
import ApiError from '../../utils/ApiError.js';
import { ROADMAPS } from './learning.constants.js';
import { searchFitnessVideos } from '../../services/youtube.service.js';

// Helper to get or create UserVideoMeta
const getUserMeta = async (userId) => {
  let meta = await UserVideoMeta.findOne({ user: userId });
  if (!meta) {
    meta = await UserVideoMeta.create({ user: userId });
  }
  return meta;
};

// ─── Videos ─────────────────────────────────────────────────────────────────

export const getVideos = async (query) => {
  const { page = 1, limit = 20, search, category, difficulty, isFeatured } = query;
  const filter = {};

  const activeCategory = category && category !== 'All' ? category : undefined;

  if (search) filter.$text = { $search: search };
  if (activeCategory) filter.category = activeCategory;
  if (difficulty) filter.difficulty = difficulty;
  if (isFeatured !== undefined) filter.isFeatured = isFeatured;

  // Use text score for sorting if searching, otherwise newest first
  const sort = search ? { score: { $meta: 'textScore' } } : { createdAt: -1 };
  
  // Attempt to fetch from DB first
  let paginatedResults = await getPaginatedResults(Video, filter, { page, limit, sort });

  // If we have less than a few results, and we are querying by search or category (or just default load),
  // we can lazily fetch from YouTube to seed the DB.
  if (paginatedResults.docs.length < 5 && page === 1) {
    const seedQuery = search || activeCategory || 'Fitness Workout';
    try {
      // This will hit YouTube API and cache to MongoDB automatically
      await searchFitnessVideos({ q: seedQuery, maxResults: 10 });
      // Re-fetch from DB now that it's seeded
      paginatedResults = await getPaginatedResults(Video, filter, { page, limit, sort });
    } catch (err) {
      console.error('Failed to seed videos from YouTube:', err);
    }
  }

  return paginatedResults;
};

export const getVideoById = async (userId, videoId) => {
  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, 'Video not found');

  // Track history asynchronously (don't await)
  getUserMeta(userId).then(meta => {
    // Remove if already in history
    meta.history = meta.history.filter(h => h.video.toString() !== videoId.toString());
    // Add to front, keep max 100
    meta.history.unshift({ video: videoId, watchedAt: Date.now() });
    if (meta.history.length > 100) meta.history.pop();
    meta.save().catch(err => console.error('Failed to save history', err));
  });

  return video;
};

export const getRelatedVideos = async (videoId) => {
  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, 'Video not found');

  // Rule-based engine: Match Category, then Difficulty, exclude current video
  const filter = {
    _id: { $ne: video._id },
    $or: [
      { category: video.category },
      { tags: { $in: video.tags } }
    ]
  };

  return Video.find(filter)
    .sort({ difficulty: video.difficulty === 'Beginner' ? 1 : -1, createdAt: -1 }) // Simple heuristic
    .limit(10);
};

// ─── Roadmaps ───────────────────────────────────────────────────────────────

export const getRoadmaps = async () => {
  return ROADMAPS;
};

export const getRoadmapById = async (id) => {
  const roadmap = ROADMAPS.find(r => r.id === id);
  if (!roadmap) throw new ApiError(404, 'Roadmap not found');
  
  // Attach example videos to each step based on skillKeyword
  const populatedSteps = await Promise.all(roadmap.steps.map(async (step) => {
    // Basic regex search for the keyword in the skill field
    const videos = await Video.find({
      category: roadmap.category,
      $or: [
        { skill: { $regex: step.skillKeyword, $options: 'i' } },
        { tags: { $regex: step.skillKeyword, $options: 'i' } }
      ]
    }).limit(3).select('_id title thumbnail duration');
    
    return { ...step, recommendedVideos: videos };
  }));

  return { ...roadmap, steps: populatedSteps };
};

// ─── User Library (Favorites, Watch Later, History) ─────────────────────────

export const getUserLibrary = async (userId) => {
  const meta = await getUserMeta(userId);
  await meta.populate('favorites watchLater history.video');
  return {
    favorites: meta.favorites,
    watchLater: meta.watchLater,
    history: meta.history
  };
};

export const toggleFavorite = async (userId, videoId) => {
  const meta = await getUserMeta(userId);
  const index = meta.favorites.findIndex(id => id.toString() === videoId.toString());
  
  if (index === -1) {
    meta.favorites.push(videoId);
  } else {
    meta.favorites.splice(index, 1);
  }
  
  await meta.save();
  return { isFavorite: index === -1 };
};

export const toggleWatchLater = async (userId, videoId) => {
  const meta = await getUserMeta(userId);
  const index = meta.watchLater.findIndex(id => id.toString() === videoId.toString());
  
  if (index === -1) {
    meta.watchLater.push(videoId);
  } else {
    meta.watchLater.splice(index, 1);
  }
  
  await meta.save();
  return { isWatchLater: index === -1 };
};

export const clearHistory = async (userId) => {
  const meta = await getUserMeta(userId);
  meta.history = [];
  await meta.save();
  return { success: true };
};
