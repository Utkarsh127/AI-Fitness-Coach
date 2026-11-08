/**
 * @module modules/messaging/messaging.controller
 * @description Controllers for the Messaging System.
 */

import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import * as messagingService from './messaging.service.js';

export const getConversations = asyncHandler(async (req, res) => {
  const result = await messagingService.getConversations(req.user._id, req.query);
  res.status(200).json(new ApiResponse(200, result, 'Conversations fetched successfully'));
});

export const createConversation = asyncHandler(async (req, res) => {
  const conv = await messagingService.createConversation(req.user._id, req.body);
  res.status(201).json(new ApiResponse(201, conv, 'Conversation created successfully'));
});

export const getMessages = asyncHandler(async (req, res) => {
  const result = await messagingService.getMessages(req.user._id, req.params.conversationId, req.query);
  res.status(200).json(new ApiResponse(200, result, 'Messages fetched successfully'));
});

export const sendMessage = asyncHandler(async (req, res) => {
  const msg = await messagingService.sendMessage(req.user._id, req.body, req.files);
  res.status(201).json(new ApiResponse(201, msg, 'Message sent successfully'));
});

export const deleteMessageForMe = asyncHandler(async (req, res) => {
  await messagingService.deleteMessageForMe(req.user._id, req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Message deleted for you'));
});

export const deleteMessageForEveryone = asyncHandler(async (req, res) => {
  await messagingService.deleteMessageForEveryone(req.user._id, req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Message deleted for everyone'));
});
