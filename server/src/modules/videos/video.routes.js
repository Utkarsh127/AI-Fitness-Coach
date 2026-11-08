/**
 * @module modules/videos/video.routes
 * @description Routes for fitness video feed.
 */

import { Router } from 'express';
import { searchVideos, getVideoDetails } from './video.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { apiLimiter } from '../../middlewares/rateLimiter.middleware.js';

const router = Router();

// Apply auth middleware to all routes in this group
router.use(protect);
// Apply specific rate limit to protect YouTube API Quota
router.use(apiLimiter);

router.get('/search', searchVideos);
router.get('/:videoId', getVideoDetails);

export default router;
