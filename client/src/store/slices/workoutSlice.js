/**
 * @module store/slices/workoutSlice
 * @description Redux slice for Workout Plans, Active Session, Logs, and Stats.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import * as workoutApi from '../../api/workout.api.js';

export const fetchWorkoutPlans = createAsyncThunk('workout/fetchPlans', async (params, { rejectWithValue }) => {
  try {
    const res = await workoutApi.getWorkoutPlans(params);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch plans');
  }
});

export const fetchWorkoutPlanDetails = createAsyncThunk('workout/fetchPlanDetails', async (id, { rejectWithValue }) => {
  try {
    const res = await workoutApi.getWorkoutPlanById(id);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch plan details');
  }
});

export const logWorkoutSession = createAsyncThunk('workout/logSession', async (data, { rejectWithValue }) => {
  try {
    const res = await workoutApi.logWorkout(data);
    return res.data.data; // { log, newPRs }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to log workout');
  }
});

export const fetchWorkoutHistory = createAsyncThunk('workout/fetchHistory', async (params, { rejectWithValue }) => {
  try {
    const res = await workoutApi.getWorkoutHistory(params);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch history');
  }
});

export const fetchStatsAndPRs = createAsyncThunk('workout/fetchStatsAndPRs', async (_, { rejectWithValue }) => {
  try {
    const [statsRes, prsRes] = await Promise.all([
      workoutApi.getWorkoutStats(),
      workoutApi.getPersonalRecords()
    ]);
    return { stats: statsRes.data.data, prs: prsRes.data.data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch stats');
  }
});

const initialState = {
  plans: [],
  plansPagination: { page: 1, totalPages: 1 },
  currentPlan: null,
  
  history: [],
  historyPagination: { page: 1, totalPages: 1 },
  
  stats: null,
  prs: [],
  
  activeWorkout: null, // Holds currently running workout state
  
  isLoading: false,
  error: null,
};

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    startActiveWorkout: (state, action) => {
      // action.payload should be the specific day's workout data
      state.activeWorkout = {
        ...action.payload,
        startTime: Date.now(),
        completedExercises: [],
      };
    },
    updateActiveWorkout: (state, action) => {
      state.activeWorkout = { ...state.activeWorkout, ...action.payload };
    },
    clearActiveWorkout: (state) => {
      state.activeWorkout = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Plans
      .addCase(fetchWorkoutPlans.pending, (state) => { state.isLoading = true; })
      .addCase(fetchWorkoutPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans = action.payload.docs;
        state.plansPagination = { page: action.payload.page, totalPages: action.payload.totalPages };
      })
      .addCase(fetchWorkoutPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Plan Details
      .addCase(fetchWorkoutPlanDetails.pending, (state) => { state.isLoading = true; })
      .addCase(fetchWorkoutPlanDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPlan = action.payload;
      })
      // Log Session
      .addCase(logWorkoutSession.pending, (state) => { state.isLoading = true; })
      .addCase(logWorkoutSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeWorkout = null;
        if (action.payload.newPRs?.length > 0) {
          toast.success(`Workout logged! You hit ${action.payload.newPRs.length} new PRs! 🏆`);
        } else {
          toast.success('Workout logged successfully! Great job.');
        }
      })
      // Fetch History
      .addCase(fetchWorkoutHistory.pending, (state) => { state.isLoading = true; })
      .addCase(fetchWorkoutHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.history = action.payload.docs;
        state.historyPagination = { page: action.payload.page, totalPages: action.payload.totalPages };
      })
      // Stats & PRs
      .addCase(fetchStatsAndPRs.fulfilled, (state, action) => {
        state.stats = action.payload.stats;
        state.prs = action.payload.prs;
      });
  },
});

export const { startActiveWorkout, updateActiveWorkout, clearActiveWorkout } = workoutSlice.actions;
export default workoutSlice.reducer;
