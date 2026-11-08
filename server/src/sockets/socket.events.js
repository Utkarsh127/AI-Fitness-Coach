/**
 * @module sockets/socket.events
 * @description Event handlers for Socket.IO.
 */

import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';

// Map of userId to Set of socketIds (to support multiple tabs)
export const onlineUsers = new Map();

export const initSocketEvents = (io, socket) => {
  const userId = socket.user._id.toString();

  // Add to online users
  let isNewConnection = false;
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
    isNewConnection = true;
  }
  onlineUsers.get(userId).add(socket.id);

  // Join personal room for user-specific notifications
  socket.join(userId);

  // Send current online users to the newly connected client
  const currentOnlineUsers = Array.from(onlineUsers.keys());
  socket.emit('initialOnlineUsers', currentOnlineUsers);

  socket.on('requestOnlineUsers', () => {
    socket.emit('initialOnlineUsers', Array.from(onlineUsers.keys()));
  });

  // Broadcast online status to all others ONLY if it's a new device/connection state
  if (isNewConnection) {
    socket.broadcast.emit('userOnline', userId);
  }

  // Handle joining a conversation room
  socket.on('joinConversation', (conversationId) => {
    socket.join(conversationId);
    // User joined room
  });

  socket.on('leaveConversation', (conversationId) => {
    socket.leave(conversationId);
  });

  // Handle typing indicators
  socket.on('typing', ({ conversationId }) => {
    socket.to(conversationId).emit('typing', { conversationId, userId });
  });

  socket.on('stopTyping', ({ conversationId }) => {
    socket.to(conversationId).emit('stopTyping', { conversationId, userId });
  });

  // Handle read receipts
  socket.on('markAsRead', async ({ conversationId, messageIds }) => {
    try {
      if (!messageIds || messageIds.length === 0) return;
      
      // Update DB
      await Message.updateMany(
        { _id: { $in: messageIds }, 'readBy.user': { $ne: userId } },
        { $push: { readBy: { user: userId, readAt: new Date() } } }
      );

      // Notify others in room
      socket.to(conversationId).emit('messagesRead', { conversationId, messageIds, readBy: userId, readAt: new Date() });
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const userSockets = onlineUsers.get(userId);
    if (userSockets) {
      userSockets.delete(socket.id);
      if (userSockets.size === 0) {
        onlineUsers.delete(userId);
        io.emit('userOffline', userId);
      }
    }
  });
};
