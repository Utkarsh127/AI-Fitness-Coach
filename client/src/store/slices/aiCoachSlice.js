/**
 * @module store/slices/aiCoachSlice
 * @description Redux slice for AI Fitness Coach state.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import * as aiApi from '../../api/ai.api.js';

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchConversations = createAsyncThunk(
  'aiCoach/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const res = await aiApi.getConversations();
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch conversations.');
    }
  }
);

export const createConversation = createAsyncThunk(
  'aiCoach/createConversation',
  async (title, { rejectWithValue }) => {
    try {
      const res = await aiApi.createConversation(title);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create conversation.');
    }
  }
);

export const fetchConversationById = createAsyncThunk(
  'aiCoach/fetchConversationById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await aiApi.getConversationById(id);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch conversation.');
    }
  }
);

export const deleteConversation = createAsyncThunk(
  'aiCoach/deleteConversation',
  async (id, { rejectWithValue }) => {
    try {
      await aiApi.deleteConversation(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete conversation.');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'aiCoach/sendMessage',
  async ({ conversationId, message }, { rejectWithValue }) => {
    try {
      const res = await aiApi.sendMessage(conversationId, message);
      // The response payload contains { userMessage, assistantMessage, title }
      return res.data.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send message.');
    }
  }
);

export const generateAiWorkoutPlan = createAsyncThunk(
  'aiCoach/generateWorkoutPlan',
  async (preferences, { rejectWithValue }) => {
    try {
      const res = await aiApi.generateWorkout(preferences);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to generate workout plan.');
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────────────────────

const initialState = {
  conversations: [],         // List of conversation summaries
  activeConversation: null,  // The fully populated current conversation
  isLoadingConversations: false,
  isLoadingActive: false,
  isSendingMessage: false,
  error: null,
  
  // Workout Generator State
  generatedWorkout: null,
  isGeneratingWorkout: false,
  generationError: null,
};

const aiCoachSlice = createSlice({
  name: 'aiCoach',
  initialState,
  reducers: {
    clearActiveConversation(state) {
      state.activeConversation = null;
    },
    optimisticUserMessage(state, action) {
      if (state.activeConversation) {
        state.activeConversation.messages.push({
          _id: 'temp-' + Date.now(),
          role: 'user',
          content: action.payload,
          createdAt: new Date().toISOString()
        });
      }
    },
    clearGeneratedWorkout(state) {
      state.generatedWorkout = null;
      state.generationError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchConversations
      .addCase(fetchConversations.pending, (state) => {
        state.isLoadingConversations = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoadingConversations = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoadingConversations = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // createConversation
      .addCase(createConversation.fulfilled, (state, action) => {
        state.conversations.unshift(action.payload);
        state.activeConversation = action.payload;
      })
      .addCase(createConversation.rejected, (state, action) => {
        toast.error(action.payload);
      })

      // fetchConversationById
      .addCase(fetchConversationById.pending, (state) => {
        state.isLoadingActive = true;
        state.error = null;
      })
      .addCase(fetchConversationById.fulfilled, (state, action) => {
        state.isLoadingActive = false;
        state.activeConversation = action.payload;
      })
      .addCase(fetchConversationById.rejected, (state, action) => {
        state.isLoadingActive = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // deleteConversation
      .addCase(deleteConversation.fulfilled, (state, action) => {
        const id = action.payload;
        state.conversations = state.conversations.filter(c => c._id !== id);
        if (state.activeConversation?._id === id) {
          state.activeConversation = null;
        }
        toast.success('Conversation deleted.');
      })
      .addCase(deleteConversation.rejected, (state, action) => {
        toast.error(action.payload);
      })

      // sendMessage
      .addCase(sendMessage.pending, (state) => {
        state.isSendingMessage = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isSendingMessage = false;
        if (state.activeConversation) {
          state.activeConversation.messages = state.activeConversation.messages.filter(
            m => !m._id.toString().startsWith('temp-')
          );
          const { userMessage, assistantMessage, title } = action.payload;
          state.activeConversation.messages.push(userMessage, assistantMessage);
          
          if (title && title !== state.activeConversation.title) {
            state.activeConversation.title = title;
            const convoInList = state.conversations.find(c => c._id === state.activeConversation._id);
            if (convoInList) {
              convoInList.title = title;
            }
          }
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isSendingMessage = false;
        if (state.activeConversation) {
          state.activeConversation.messages = state.activeConversation.messages.filter(
            m => !m._id.toString().startsWith('temp-')
          );
        }
        toast.error(action.payload);
      })

      // generateAiWorkoutPlan
      .addCase(generateAiWorkoutPlan.pending, (state) => {
        state.isGeneratingWorkout = true;
        state.generationError = null;
      })
      .addCase(generateAiWorkoutPlan.fulfilled, (state, action) => {
        state.isGeneratingWorkout = false;
        state.generatedWorkout = action.payload;
        toast.success('AI Workout Plan generated successfully!');
      })
      .addCase(generateAiWorkoutPlan.rejected, (state, action) => {
        state.isGeneratingWorkout = false;
        state.generationError = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { clearActiveConversation, optimisticUserMessage, clearGeneratedWorkout } = aiCoachSlice.actions;

export default aiCoachSlice.reducer;
