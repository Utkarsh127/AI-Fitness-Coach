/**
 * @module modules/community/community.routes
 * @description Express router for the Community System.
 * Base path: /api/v1/community
 */

import { Router } from 'express';
import { protect } from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { uploadMultiple } from '../../middlewares/upload.middleware.js';
import {
  createPostValidator,
  updatePostValidator,
  commentValidator,
  searchFeedValidator,
} from './community.validator.js';
import {
  getFeed,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLikePost,
  toggleBookmarkPost,
  getSavedPosts,
  getUserPosts,
  getComments,
  addComment,
  deleteComment
} from './community.controller.js';

const router = Router();

// All community routes require authentication
router.use(protect);

// ─── Posts & Feed ────────────────────────────────────────────────────────────
router.get('/posts', searchFeedValidator, validate, getFeed);
// Use existing cloudinary multer config, max 4 images
router.post('/posts', uploadMultiple('images', 4), createPostValidator, validate, createPost);

router.get('/posts/:id([0-9a-fA-F]{24})', getPostById);
router.put('/posts/:id([0-9a-fA-F]{24})', updatePostValidator, validate, updatePost);
router.delete('/posts/:id([0-9a-fA-F]{24})', deletePost);

// ─── Interactions ────────────────────────────────────────────────────────────
router.post('/posts/:id([0-9a-fA-F]{24})/like', toggleLikePost);
router.post('/posts/:id([0-9a-fA-F]{24})/bookmark', toggleBookmarkPost);
router.get('/saved', getSavedPosts);

// ─── Comments ────────────────────────────────────────────────────────────────
router.get('/posts/:id([0-9a-fA-F]{24})/comments', getComments);
router.post('/posts/:id([0-9a-fA-F]{24})/comments', commentValidator, validate, addComment);
router.delete('/comments/:id([0-9a-fA-F]{24})', deleteComment);

// ─── User Profile ────────────────────────────────────────────────────────────
router.get('/user/:userId([0-9a-fA-F]{24})', getUserPosts);

export default router;
