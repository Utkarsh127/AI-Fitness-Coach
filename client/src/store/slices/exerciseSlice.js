/**
 * @module store/slices/exerciseSlice
 * @description Redux slice for the Exercise Library.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as exerciseApi from '../../api/exercise.api.js';

export const fetchExercises = createAsyncThunk(
  'exercise/fetchExercises',
  async (params, { rejectWithValue }) => {
    try {
      const res = await exerciseApi.getExercises(params);
      return res.data.data; // { docs, totalDocs, totalPages, page }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch exercises');
    }
  }
);

export const fetchExerciseDetails = createAsyncThunk(
  'exercise/fetchExerciseDetails',
  async (slug, { rejectWithValue }) => {
    try {
      const res = await exerciseApi.getExerciseBySlug(slug);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch exercise details');
    }
  }
);

const initialState = {
  exercises: [],
  pagination: { page: 1, totalPages: 1, totalDocs: 0 },
  currentExercise: null,
  isLoading: false,
  error: null,
};

const exerciseSlice = createSlice({
  name: 'exercise',
  initialState,
  reducers: {
    clearCurrentExercise: (state) => {
      state.currentExercise = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch List
      .addCase(fetchExercises.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchExercises.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exercises = action.payload.docs;
        state.pagination = {
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          totalDocs: action.payload.totalDocs,
        };
      })
      .addCase(fetchExercises.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Single
      .addCase(fetchExerciseDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchExerciseDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentExercise = action.payload;
      })
      .addCase(fetchExerciseDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentExercise } = exerciseSlice.actions;
export default exerciseSlice.reducer;
