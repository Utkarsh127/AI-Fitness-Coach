/**
 * @module store/slices/messagingSlice
 * @description Redux slice for chat conversations and messages.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as messagingApi from '../../api/messaging.api.js';
import socketClient from '../../sockets/socketClient.js';

// ─── THUNKS ─────────────────────────────────────────────────────────────

export const fetchConversations = createAsyncThunk('messaging/fetchConversations', async (params, { rejectWithValue }) => {
  try {
    const res = await messagingApi.getConversations(params);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch conversations');
  }
});

export const fetchMessages = createAsyncThunk('messaging/fetchMessages', async ({ conversationId, params }, { rejectWithValue }) => {
  try {
    const res = await messagingApi.getMessages(conversationId, params);
    return { conversationId, data: res.data.data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch messages');
  }
});

export const sendMessage = createAsyncThunk('messaging/sendMessage', async (formData, { rejectWithValue }) => {
  try {
    // Sending via REST so attachments go to Cloudinary
    // Server emits via Socket to update receiver
    const res = await messagingApi.sendMessage(formData);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to send message');
  }
});

export const createConversation = createAsyncThunk('messaging/createConversation', async (data, { rejectWithValue }) => {
  try {
    const res = await messagingApi.createConversation(data);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create conversation');
  }
});

export const deleteMessageForMe = createAsyncThunk('messaging/deleteMessageForMe', async (messageId, { rejectWithValue, getState }) => {
  try {
    await messagingApi.deleteMessageForMe(messageId);
    return messageId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete message');
  }
});

export const deleteMessageForEveryone = createAsyncThunk('messaging/deleteMessageForEveryone', async (messageId, { rejectWithValue }) => {
  try {
    await messagingApi.deleteMessageForEveryone(messageId);
    return messageId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete message for everyone');
  }
});

// ─── SLICE ──────────────────────────────────────────────────────────────

const initialState = {
  conversations: [],
  conversationsPagination: { page: 1, totalPages: 1 },
  activeConversationId: null,
  
  // Normalized state: { [conversationId]: [Message, Message, ...] }
  messagesByConversation: {},
  messagesPagination: {}, // { [conversationId]: { page, totalPages } }
  
  onlineUsers: [], // Array of userIds
  typingStatus: {}, // { [conversationId]: userId }
  
  isLoading: false,
  error: null,
};

const messagingSlice = createSlice({
  name: 'messaging',
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversationId = action.payload;
    },
    // Socket Events Reducers
    receiveSocketMessage: (state, action) => {
      const msg = action.payload;
      const convId = msg.conversation;
      
      if (!state.messagesByConversation[convId]) {
        state.messagesByConversation[convId] = [];
      }
      // Add if it doesn't already exist
      if (!state.messagesByConversation[convId].find(m => m._id === msg._id)) {
        state.messagesByConversation[convId].unshift(msg);
      }
      
      // Update lastMessage on conversation
      const conv = state.conversations.find(c => c._id === convId);
      if (conv) {
        conv.lastMessage = msg;
        conv.lastActivity = msg.createdAt;
        // Move to top
        state.conversations = state.conversations.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
      }
    },
    messageDeleted: (state, action) => {
      const messageId = action.payload;
      // Find and mark the message as deleted in all conversations (it should only be in one)
      Object.keys(state.messagesByConversation).forEach(convId => {
        const msgIndex = state.messagesByConversation[convId].findIndex(m => m._id === messageId);
        if (msgIndex !== -1) {
          state.messagesByConversation[convId][msgIndex].isDeleted = true;
          state.messagesByConversation[convId][msgIndex].content = '';
          state.messagesByConversation[convId][msgIndex].attachments = [];
        }
      });
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload; // Optional bulk load
    },
    userConnected: (state, action) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    userDisconnected: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(id => id !== action.payload);
    },
    setTyping: (state, action) => {
      const { conversationId, userId } = action.payload;
      state.typingStatus[conversationId] = userId;
    },
    clearTyping: (state, action) => {
      const { conversationId } = action.payload;
      delete state.typingStatus[conversationId];
    },
    markMessagesAsReadLocal: (state, action) => {
      const { conversationId, messageIds, readBy, readAt } = action.payload;
      const msgs = state.messagesByConversation[conversationId];
      if (msgs) {
        msgs.forEach(msg => {
          if (messageIds.includes(msg._id)) {
            const exists = msg.readBy.find(r => r.user === readBy);
            if (!exists) msg.readBy.push({ user: readBy, readAt });
          }
        });
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => { state.isLoading = true; })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload.docs;
        state.conversationsPagination = { page: action.payload.page, totalPages: action.payload.totalPages };
      })
      .addCase(fetchMessages.pending, (state) => { state.isLoading = true; })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        const { conversationId, data } = action.payload;
        
        const docs = Array.isArray(data?.docs) ? data.docs : (Array.isArray(data) ? data : []);
        const page = data?.page || 1;
        const totalPages = data?.totalPages || 1;

        if (page === 1) {
          state.messagesByConversation[conversationId] = docs;
        } else {
          state.messagesByConversation[conversationId] = [...(state.messagesByConversation[conversationId] || []), ...docs];
        }
        state.messagesPagination[conversationId] = { page, totalPages };
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        // Handled via receiveSocketMessage to avoid duplicates, or handled here if no socket connection
        // Optimistically add to message list if not already present
        if (action.payload) {
          const msg = action.payload;
          const convId = msg.conversation;
          if (!state.messagesByConversation[convId]) {
            state.messagesByConversation[convId] = [];
          }
          if (!state.messagesByConversation[convId].find(m => m._id === msg._id)) {
            state.messagesByConversation[convId].unshift(msg);
          }
        }
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        const conv = action.payload;
        // Add to the top if not already in list
        if (conv && !state.conversations.find(c => c._id === conv._id)) {
          state.conversations.unshift(conv);
        }
        state.activeConversationId = conv._id;
      })
      .addCase(deleteMessageForMe.fulfilled, (state, action) => {
        const messageId = action.payload;
        Object.keys(state.messagesByConversation).forEach(convId => {
          state.messagesByConversation[convId] = state.messagesByConversation[convId].filter(m => m._id !== messageId);
        });
      })
      .addCase(deleteMessageForEveryone.fulfilled, (state, action) => {
        // Optimistically delete for everyone
        const messageId = action.payload;
        Object.keys(state.messagesByConversation).forEach(convId => {
          const msgIndex = state.messagesByConversation[convId].findIndex(m => m._id === messageId);
          if (msgIndex !== -1) {
            state.messagesByConversation[convId][msgIndex].isDeleted = true;
            state.messagesByConversation[convId][msgIndex].content = '';
            state.messagesByConversation[convId][msgIndex].attachments = [];
          }
        });
      });
  }
});

export const { 
  setActiveConversation, 
  receiveSocketMessage,
  setOnlineUsers,
  userConnected,
  userDisconnected,
  setTyping,
  clearTyping,
  markMessagesAsReadLocal,
  messageDeleted
} = messagingSlice.actions;
export default messagingSlice.reducer;
