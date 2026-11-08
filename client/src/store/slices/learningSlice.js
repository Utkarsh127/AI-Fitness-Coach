/**
 * @module store/slices/learningSlice
 * @description Redux slice for Learning Hub and Video Library.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as learningApi from '../../api/learning.api.js';

export const fetchVideos = createAsyncThunk('learning/fetchVideos', async (params, { rejectWithValue }) => {
  try {
    const res = await learningApi.getVideos(params);
    return { data: res.data.data, page: params.page || 1 };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch videos');
  }
});

export const fetchVideoById = createAsyncThunk('learning/fetchVideoById', async (id, { rejectWithValue }) => {
  try {
    const res = await learningApi.getVideoById(id);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch video');
  }
});

export const fetchRoadmaps = createAsyncThunk('learning/fetchRoadmaps', async (_, { rejectWithValue }) => {
  try {
    const res = await learningApi.getRoadmaps();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch roadmaps');
  }
});

export const fetchRoadmapById = createAsyncThunk('learning/fetchRoadmapById', async (id, { rejectWithValue }) => {
  try {
    const res = await learningApi.getRoadmapById(id);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch roadmap');
  }
});

export const fetchUserLibrary = createAsyncThunk('learning/fetchLibrary', async (_, { rejectWithValue }) => {
  try {
    const res = await learningApi.getUserLibrary();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch library');
  }
});

export const toggleFavorite = createAsyncThunk('learning/toggleFavorite', async (id, { rejectWithValue }) => {
  try {
    await learningApi.toggleFavorite(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to toggle favorite');
  }
});

export const toggleWatchLater = createAsyncThunk('learning/toggleWatchLater', async (id, { rejectWithValue }) => {
  try {
    await learningApi.toggleWatchLater(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to toggle watch later');
  }
});

export const clearHistory = createAsyncThunk('learning/clearHistory', async (_, { rejectWithValue }) => {
  try {
    await learningApi.clearHistory();
    return true;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to clear history');
  }
});

const learningSlice = createSlice({
  name: 'learning',
  initialState: {
    videos: [],
    pagination: { page: 1, totalPages: 1 },
    activeVideo: null,
    relatedVideos: [],
    roadmaps: [],
    activeRoadmap: null,
    favorites: [],
    watchLater: [],
    history: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => { state.isLoading = true; })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.page === 1) {
          state.videos = action.payload.data.docs;
        } else {
          state.videos = [...state.videos, ...action.payload.data.docs];
        }
        state.pagination = { page: action.payload.data.page, totalPages: action.payload.data.totalPages };
      })
      .addCase(fetchVideoById.pending, (state) => { state.isLoading = true; state.activeVideo = null; })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeVideo = action.payload.video;
        state.relatedVideos = action.payload.related;
      })
      .addCase(fetchRoadmaps.fulfilled, (state, action) => {
        state.roadmaps = action.payload;
      })
      .addCase(fetchRoadmapById.fulfilled, (state, action) => {
        state.activeRoadmap = action.payload;
      })
      .addCase(fetchUserLibrary.fulfilled, (state, action) => {
        state.favorites = action.payload.favorites;
        state.watchLater = action.payload.watchLater;
        state.history = action.payload.history;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const id = action.payload;
        if (state.favorites.some(v => v._id === id || v === id)) {
          state.favorites = state.favorites.filter(v => v._id !== id && v !== id);
        } else if (state.activeVideo && state.activeVideo._id === id) {
          state.favorites.push(state.activeVideo);
        }
      })
      .addCase(toggleWatchLater.fulfilled, (state, action) => {
        const id = action.payload;
        if (state.watchLater.some(v => v._id === id || v === id)) {
          state.watchLater = state.watchLater.filter(v => v._id !== id && v !== id);
        } else if (state.activeVideo && state.activeVideo._id === id) {
          state.watchLater.push(state.activeVideo);
        }
      })
      .addCase(clearHistory.fulfilled, (state) => {
        state.history = [];
      });
  }
});

export default learningSlice.reducer;
