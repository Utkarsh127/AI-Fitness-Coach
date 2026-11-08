/**
 * @module modules/shorts/shorts.routes
 * @description Express routes for the Fitness Shorts API.
 */

import express from 'express';
import { getShorts, getShortById } from './shorts.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Apply auth middleware to all routes in this group
router.use(protect);

router.route('/')
  .get(getShorts);

router.route('/:id')
  .get(getShortById);

export default router;
