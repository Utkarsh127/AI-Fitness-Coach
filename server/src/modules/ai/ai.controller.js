/**
 * @module modules/ai/ai.controller
 * @description Controller for AI features including conversations.
 */

import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import ApiError from '../../utils/ApiError.js';
import * as aiService from '../../services/ai.service.js';
import * as aiCoachService from '../../services/aiCoach.service.js';
import AiConversation from '../../models/aiConversation.model.js';

/**
 * @desc    Test Gemini AI connectivity
 * @route   POST /api/v1/ai/test
 * @access  Private
 */
export const testAI = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const systemInstruction = 'You are an AI fitness coach. Keep responses brief and encouraging.';
  const responseText = await aiService.generateText({
    prompt: message,
    systemInstruction,
  });
  res.status(200).json(new ApiResponse(200, { message: responseText }, 'AI test successful'));
});

/**
 * @desc    Get all conversations for the user
 * @route   GET /api/v1/ai/conversations
 * @access  Private
 */
export const getConversations = asyncHandler(async (req, res) => {
  const conversations = await AiConversation.find({ user: req.user._id })
    .sort({ lastMessageAt: -1 })
    .select('title lastMessageAt updatedAt')
    .limit(50); // Sensible limit

  res.status(200).json(new ApiResponse(200, conversations, 'Conversations retrieved'));
});

/**
 * @desc    Create a new AI conversation
 * @route   POST /api/v1/ai/conversations
 * @access  Private
 */
export const createConversation = asyncHandler(async (req, res) => {
  const { title } = req.body;
  
  const conversation = await AiConversation.create({
    user: req.user._id,
    title: title || 'New Conversation',
    messages: [],
  });

  res.status(201).json(new ApiResponse(201, conversation, 'Conversation created'));
});

/**
 * @desc    Get a single conversation by ID
 * @route   GET /api/v1/ai/conversations/:id
 * @access  Private
 */
export const getConversationById = asyncHandler(async (req, res) => {
  const conversation = await AiConversation.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!conversation) {
    throw new ApiError(404, 'Conversation not found');
  }

  res.status(200).json(new ApiResponse(200, conversation, 'Conversation retrieved'));
});

/**
 * @desc    Delete a conversation
 * @route   DELETE /api/v1/ai/conversations/:id
 * @access  Private
 */
export const deleteConversation = asyncHandler(async (req, res) => {
  const conversation = await AiConversation.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!conversation) {
    throw new ApiError(404, 'Conversation not found');
  }

  res.status(200).json(new ApiResponse(200, null, 'Conversation deleted'));
});

/**
 * @desc    Send a message to a conversation and get AI response
 * @route   POST /api/v1/ai/conversations/:id/messages
 * @access  Private
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const conversationId = req.params.id;

  // 1. Load conversation and verify ownership
  const conversation = await AiConversation.findOne({
    _id: conversationId,
    user: req.user._id,
  });

  if (!conversation) {
    throw new ApiError(404, 'Conversation not found');
  }

  // 2. Prepare user message and add to DB temporarily
  const userMessage = { role: 'user', content: message };
  
  // 3. Get AI Response (handles context, history limits, Gemini call)
  const assistantResponseText = await aiCoachService.getCoachResponse(
    req.user._id.toString(),
    conversation.messages,
    message
  );

  // 4. Save both messages to the conversation
  const assistantMessage = { role: 'assistant', content: assistantResponseText };
  
  conversation.messages.push(userMessage, assistantMessage);
  
  // Auto-generate a title from the first message if it's the default
  if (conversation.title === 'New Conversation' && conversation.messages.length <= 2) {
    conversation.title = message.substring(0, 30) + (message.length > 30 ? '...' : '');
  }

  conversation.lastMessageAt = Date.now();
  await conversation.save();

  // Return only the new messages to the client
  res.status(201).json(new ApiResponse(201, {
    userMessage: conversation.messages[conversation.messages.length - 2],
    assistantMessage: conversation.messages[conversation.messages.length - 1],
    title: conversation.title
  }, 'Message sent successfully'));
});

/**
 * @desc    Generate a structured workout plan using AI
 * @route   POST /api/v1/ai/workouts/generate
 * @access  Private
 */
import * as aiWorkoutService from '../../services/aiWorkout.service.js';

export const generateWorkoutPlan = asyncHandler(async (req, res) => {
  const preferences = req.body;
  
  const generatedPlan = await aiWorkoutService.generateWorkoutPlan(req.user._id, preferences);
  
  res.status(200).json(new ApiResponse(200, generatedPlan, 'Workout plan generated successfully'));
});
