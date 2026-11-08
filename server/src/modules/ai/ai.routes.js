/**
 * @module modules/ai/ai.routes
 * @description Routes for AI endpoints.
 */

import express from 'express';
import {
  testAI,
  getConversations,
  createConversation,
  getConversationById,
  deleteConversation,
  sendMessage
} from './ai.controller.js';
import { validateAiTest, validateCreateConversation, validateSendMessage } from './ai.validation.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { aiLimiter } from '../../middlewares/rateLimiter.middleware.js';
import validate from '../../middlewares/validate.middleware.js';

const router = express.Router();

// All AI routes require authentication
router.use(protect);

// Test route
router.post('/test', aiLimiter, validateAiTest, validate, testAI);

// Conversation management routes
router.get('/conversations', getConversations);
router.post('/conversations', validateCreateConversation, validate, createConversation);
router.get('/conversations/:id', getConversationById);
router.delete('/conversations/:id', deleteConversation);

// Message sending applies AI rate limit
router.post('/conversations/:id/messages', aiLimiter, validateSendMessage, validate, sendMessage);

// AI Workout Generation route
import { validateGenerateWorkout } from './ai.validation.js';
import { generateWorkoutPlan } from './ai.controller.js';
router.post('/workouts/generate', aiLimiter, validateGenerateWorkout, validate, generateWorkoutPlan);

export default router;
