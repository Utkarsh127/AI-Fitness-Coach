/**
 * @module modules/messaging/messaging.routes
 * @description Express router for the Messaging System.
 * Base path: /api/v1/messages
 */

import { Router } from 'express';
import { protect } from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { uploadMultiple } from '../../middlewares/upload.middleware.js';
import {
  createConversationValidator,
  sendMessageValidator,
  getMessagesValidator,
} from './messaging.validator.js';
import {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  deleteMessageForMe,
  deleteMessageForEveryone
} from './messaging.controller.js';

const router = Router();

router.use(protect);

// Conversations
router.get('/conversations', getConversations);
router.post('/conversations', createConversationValidator, validate, createConversation);

// Messages
router.get('/', (req, res) => {
  res.status(200).json({ success: true, data: { docs: [], page: 1, totalPages: 1 }, message: 'No conversation selected' });
});

router.get('/:conversationId([0-9a-fA-F]{24})', getMessagesValidator, validate, getMessages);

// Send message (handles text and up to 5 file/image uploads)
router.post('/', uploadMultiple('attachments', 5), sendMessageValidator, validate, sendMessage);

router.delete('/:id([0-9a-fA-F]{24})/for-me', deleteMessageForMe);
router.delete('/:id([0-9a-fA-F]{24})/for-everyone', deleteMessageForEveryone);

export default router;
