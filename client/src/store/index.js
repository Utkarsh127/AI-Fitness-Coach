/**
 * @module store/index
 * @description Redux store configuration.
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import uiReducer from './slices/uiSlice.js';
import profileReducer from './slices/profileSlice.js';
import exerciseReducer from './slices/exerciseSlice.js';
import workoutReducer from './slices/workoutSlice.js';
import communityReducer from './slices/communitySlice.js';
import nutritionReducer from './slices/nutritionSlice.js';
import challengeReducer from './slices/challengeSlice.js';
import notificationReducer from './slices/notificationSlice.js';
import messagingReducer from './slices/messagingSlice.js';
import learningReducer from './slices/learningSlice.js';
import aiCoachReducer from './slices/aiCoachSlice.js';
import videoFeedReducer from './slices/videoFeedSlice.js';
import shortsReducer from './slices/shortsSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    ui: uiReducer,
    exercise: exerciseReducer,
    workout: workoutReducer,
    community: communityReducer,
    nutrition: nutritionReducer,
    challenge: challengeReducer,
    notifications: notificationReducer,
    messaging: messagingReducer,
    learning: learningReducer,
    aiCoach: aiCoachReducer,
    videoFeed: videoFeedReducer,
    shorts: shortsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serialisable values in specific paths if needed
        ignoredActions: [],
      },
    }),
  devTools: import.meta.env.DEV,
});

export default store;
