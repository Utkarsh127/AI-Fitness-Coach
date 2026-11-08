/**
 * @module modules/learning/learning.routes
 * @description Express router for the Learning Hub.
 * Base path: /api/v1/learning
 */

import { Router } from 'express';
import { protect } from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { getVideosValidator, videoIdValidator } from './learning.validator.js';
import {
  getVideos,
  getVideoById,
  getRoadmaps,
  getRoadmapById,
  getUserLibrary,
  toggleFavorite,
  toggleWatchLater,
  clearHistory
} from './learning.controller.js';

const router = Router();

router.use(protect);

// Roadmaps
router.get('/roadmaps', getRoadmaps);
router.get('/roadmaps/:id', getRoadmapById);

// User Library
router.get('/library', getUserLibrary);
router.delete('/history/clear', clearHistory);

// Videos
router.get('/videos', getVideosValidator, validate, getVideos);
router.get('/videos/:id', videoIdValidator, validate, getVideoById);

// Toggles
router.post('/favorites/:id', videoIdValidator, validate, toggleFavorite);
router.post('/watch-later/:id', videoIdValidator, validate, toggleWatchLater);

export default router;
