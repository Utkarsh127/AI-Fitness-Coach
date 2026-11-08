/**
 * @module modules/messaging/messaging.service
 * @description Business logic for real-time messaging.
 */

import Conversation from '../../models/conversation.model.js';
import Message from '../../models/message.model.js';
import ApiError from '../../utils/ApiError.js';
import { getPaginatedResults } from '../../utils/pagination.js';
import { getIO } from '../../sockets/socket.js';
import { createNotification } from '../notifications/notification.service.js';

export const getConversations = async (userId, query) => {
  const { page = 1, limit = 20 } = query;
  
  const filter = { participants: userId, isArchived: false };
  const populate = [
    { path: 'participants', select: 'name username profilePicture' },
    { path: 'lastMessage', select: 'content messageType sender createdAt isDeleted', populate: { path: 'sender', select: 'name' } }
  ];

  return getPaginatedResults(Conversation, filter, { page, limit, sort: { lastActivity: -1 }, populate });
};

export const createConversation = async (userId, data) => {
  const { participants, type = 'private', groupName, groupImage } = data;
  
  // Ensure the requesting user is in the participants list
  const allParticipants = [...new Set([...participants, userId.toString()])];

  if (type === 'private') {
    if (allParticipants.length !== 2) throw new ApiError(400, 'Private chats must have exactly 2 participants');
    // Check if private chat already exists
    const existing = await Conversation.findOne({
      type: 'private',
      participants: { $all: allParticipants, $size: 2 }
    }).populate('participants', 'name username profilePicture');

    if (existing) return existing;
  }

  if (type === 'group' && (!groupName || groupName.trim() === '')) {
    throw new ApiError(400, 'Group name is required for group chats');
  }

  const conversation = await Conversation.create({
    participants: allParticipants,
    type,
    groupName: type === 'group' ? groupName : undefined,
    groupImage: type === 'group' ? groupImage : undefined,
    createdBy: userId,
    admins: type === 'group' ? [userId] : [],
  });

  return Conversation.findById(conversation._id).populate('participants', 'name username profilePicture');
};

export const getMessages = async (userId, conversationId, query) => {
  const { page = 1, limit = 50 } = query;

  // Verify access
  const conv = await Conversation.findOne({ _id: conversationId, participants: userId });
  if (!conv) throw new ApiError(403, 'You do not have access to this conversation');

  const filter = { 
    conversation: conversationId, 
    deletedFor: { $ne: userId }
  };
  const populate = [
    { path: 'sender', select: 'name username profilePicture' },
    { path: 'replyTo', select: 'content messageType sender', populate: { path: 'sender', select: 'name' } }
  ];

  return getPaginatedResults(Message, filter, { page, limit, sort: { createdAt: -1 }, populate });
};

export const sendMessage = async (userId, data, files = []) => {
  const { conversationId, content, messageType = 'Text', replyTo, isForwarded } = data;
  let { forwardedAttachments = [] } = data;

  const conv = await Conversation.findOne({ _id: conversationId, participants: userId });
  if (!conv) throw new ApiError(403, 'Conversation not found or access denied');

  // Normalize forwardedAttachments to an array
  if (forwardedAttachments && !Array.isArray(forwardedAttachments)) {
    forwardedAttachments = [forwardedAttachments];
  }

  if (!content && files.length === 0 && forwardedAttachments.length === 0) {
    throw new ApiError(400, 'Message cannot be empty');
  }

  const attachments = [...forwardedAttachments, ...files.map(f => f.path)];
  const actualMessageType = attachments.length > 0 ? (messageType === 'Text' ? 'Image' : messageType) : messageType;

  let message = await Message.create({
    conversation: conversationId,
    sender: userId,
    content,
    messageType: actualMessageType,
    attachments,
    replyTo: replyTo || undefined,
    isForwarded: isForwarded === 'true' || isForwarded === true
  });

  // Update conversation last activity
  conv.lastMessage = message._id;
  conv.lastActivity = Date.now();
  await conv.save();

  // Populate for return/socket
  message = await Message.findById(message._id)
    .populate('sender', 'name username profilePicture')
    .populate({ path: 'replyTo', select: 'content sender', populate: { path: 'sender', select: 'name' } });

  // Emit to socket room
  try {
    const io = getIO();
    io.to(conversationId.toString()).emit('receiveMessage', message);

    // Trigger notifications for other participants
    const otherParticipants = conv.participants.filter(p => p.toString() !== userId.toString());
    for (const recipientId of otherParticipants) {
      // Create chat notification (this handles throttling internally)
      await createNotification({
        recipient: recipientId,
        sender: userId,
        type: 'New Chat Message',
        title: conv.type === 'group' ? `New message in ${conv.groupName}` : `New message from ${message.sender.name}`,
        message: content || `Sent a ${actualMessageType.toLowerCase()}`,
        image: conv.type === 'group' ? conv.groupImage : message.sender.profilePicture,
        actionUrl: `/messages?c=${conversationId}`,
        entityType: 'Conversation',
        entityId: conversationId
      });
    }
  } catch (err) {
    console.error('Socket/Notification error on emit message', err);
  }

  return message;
};

export const deleteMessageForMe = async (userId, messageId) => {
  const message = await Message.findById(messageId);
  if (!message) throw new ApiError(404, 'Message not found');

  // Verify user is part of the conversation
  const conv = await Conversation.findOne({ _id: message.conversation, participants: userId });
  if (!conv) throw new ApiError(403, 'You do not have access to this conversation');

  if (!message.deletedFor.includes(userId)) {
    message.deletedFor.push(userId);
    await message.save();
  }
};

export const deleteMessageForEveryone = async (userId, messageId) => {
  const message = await Message.findOne({ _id: messageId });
  if (!message) throw new ApiError(404, 'Message not found');

  if (message.sender.toString() !== userId.toString()) {
    throw new ApiError(403, 'You can only delete your own messages for everyone');
  }

  if (!message.isDeleted) {
    message.isDeleted = true;
    // We clear the content to ensure it's not visible anywhere in the DB anymore
    message.content = '';
    message.attachments = [];
    await message.save();
  }

  try {
    const io = getIO();
    io.to(message.conversation.toString()).emit('messageDeleted', messageId);
  } catch (err) {
    console.error('Socket error on delete message', err);
  }
};
