import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance.js';

import axios from 'axios';

export const fetchShorts = createAsyncThunk(
  'shorts/fetchShorts',
  async ({ category, skill, difficulty, pageToken }, { rejectWithValue, signal }) => {
    try {
      const params = {};
      if (category && category !== 'ALL') params.category = category.toLowerCase();
      if (skill && skill !== 'ALL') params.skill = skill.toLowerCase();
      if (difficulty && difficulty !== 'ALL') params.difficulty = difficulty.toLowerCase();
      if (pageToken) params.pageToken = pageToken;

      const response = await api.get('/shorts', { params, signal });
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        return rejectWithValue('__CANCELLED__');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shorts');
    }
  }
);

export const fetchShortDetails = createAsyncThunk(
  'shorts/fetchShortDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shorts/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch short details');
    }
  }
);

const initialState = {
  shorts: [],
  nextPageToken: null,
  activeShort: null,
  isLoading: false,
  error: null,
  filters: {
    category: 'ALL',
    skill: 'ALL',
    difficulty: 'ALL'
  }
};

const shortsSlice = createSlice({
  name: 'shorts',
  initialState,
  reducers: {
    setShortsFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset shorts list when filters change so we can fetch new ones cleanly
      state.shorts = [];
      state.nextPageToken = null;
    },
    clearShorts: (state) => {
      state.shorts = [];
      state.nextPageToken = null;
    },
    clearActiveShort: (state) => {
      state.activeShort = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Shorts
      .addCase(fetchShorts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchShorts.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // If it's a new page request (nextPageToken exists in payload args ideally, but we check if we already have it)
        // Wait, Redux doesn't easily know if it's a "load more" vs "new filter" just from payload unless we pass it.
        // But since `setShortsFilters` clears `state.shorts`, we can just append or set based on if state.shorts is empty.
        
        if (state.shorts.length === 0) {
           state.shorts = action.payload.data;
        } else {
           // Append avoiding duplicates
           const newShorts = action.payload.data.filter(newS => !state.shorts.some(s => s.id === newS.id));
           state.shorts = [...state.shorts, ...newShorts];
        }
        
        state.nextPageToken = action.payload.nextPageToken;
      })
      .addCase(fetchShorts.rejected, (state, action) => {
        if (action.payload === '__CANCELLED__') {
          // Do not show error for cancelled requests
          return;
        }
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Short Details
      .addCase(fetchShortDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchShortDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeShort = action.payload.data;
      })
      .addCase(fetchShortDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { setShortsFilters, clearShorts, clearActiveShort } = shortsSlice.actions;
export default shortsSlice.reducer;
