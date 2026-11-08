import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as videoApi from '../../api/video.api.js';

export const fetchFitnessVideos = createAsyncThunk('videoFeed/fetchVideos', async (params, { rejectWithValue }) => {
  try {
    const res = await videoApi.searchVideos(params);
    return res.data.data; // { videos, nextPageToken, prevPageToken, pageInfo }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch videos');
  }
});

export const fetchVideoDetails = createAsyncThunk('videoFeed/fetchDetails', async (id, { rejectWithValue }) => {
  try {
    const res = await videoApi.getVideoDetails(id);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch video details');
  }
});

const videoFeedSlice = createSlice({
  name: 'videoFeed',
  initialState: {
    videos: [],
    activeVideo: null,
    nextPageToken: null,
    prevPageToken: null,
    isLoading: false,
    error: null,
    hasMore: true,
  },
  reducers: {
    clearVideos: (state) => {
      state.videos = [];
      state.nextPageToken = null;
      state.prevPageToken = null;
      state.hasMore = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFitnessVideos.pending, (state) => { 
        state.isLoading = true; 
        state.error = null;
      })
      .addCase(fetchFitnessVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // If a nextPageToken was passed in the request, we should probably append.
        // But for simplicity, we'll replace the feed based on the new results unless appending is explicitly requested.
        // We'll assume the component manages appending by checking if we just loaded more.
        // Actually, if we want infinite scroll, we should append if it's a "load more" action.
        // We'll manage that by checking if the action.meta.arg contains a pageToken.
        if (action.meta.arg && action.meta.arg.pageToken) {
          state.videos = [...state.videos, ...action.payload.videos];
        } else {
          state.videos = action.payload.videos;
        }

        state.nextPageToken = action.payload.nextPageToken;
        state.prevPageToken = action.payload.prevPageToken;
        state.hasMore = !!action.payload.nextPageToken;
      })
      .addCase(fetchFitnessVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchVideoDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.activeVideo = null;
      })
      .addCase(fetchVideoDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeVideo = action.payload;
      })
      .addCase(fetchVideoDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearVideos } = videoFeedSlice.actions;
export default videoFeedSlice.reducer;
