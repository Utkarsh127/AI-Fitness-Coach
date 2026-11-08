/**
 * @module store/slices/notificationSlice
 * @description Redux slice for user notifications.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as notificationApi from '../../api/notification.api.js';

// ─── THUNKS ─────────────────────────────────────────────────────────────

export const fetchNotifications = createAsyncThunk('notifications/fetch', async (params, { rejectWithValue }) => {
  try {
    const res = await notificationApi.getNotifications(params);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch notifications');
  }
});

export const fetchUnreadCount = createAsyncThunk('notifications/fetchCount', async (_, { rejectWithValue }) => {
  try {
    const res = await notificationApi.getUnreadCount();
    return res.data.data.count;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch unread count');
  }
});

export const markAsRead = createAsyncThunk('notifications/markRead', async (id, { rejectWithValue }) => {
  try {
    await notificationApi.markAsRead(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to mark as read');
  }
});

export const markAllAsRead = createAsyncThunk('notifications/markAllRead', async (_, { rejectWithValue }) => {
  try {
    await notificationApi.markAllAsRead();
    return true;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to mark all as read');
  }
});

export const deleteNotification = createAsyncThunk('notifications/delete', async (id, { rejectWithValue }) => {
  try {
    await notificationApi.deleteNotification(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete notification');
  }
});

export const clearAllNotifications = createAsyncThunk('notifications/clearAll', async (_, { rejectWithValue }) => {
  try {
    await notificationApi.clearAllNotifications();
    return true;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to clear notifications');
  }
});

// ─── SLICE ──────────────────────────────────────────────────────────────

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    unreadCount: 0,
    pagination: { page: 1, totalPages: 1 },
    isLoading: false,
    error: null,
  },
  reducers: {
    receiveRealTimeNotification: (state, action) => {
      const notification = action.payload;
      
      // Throttle Check (Update existing Chat Notification if exists and unread)
      if (notification.type === 'New Chat Message') {
        const existingIdx = state.items.findIndex(n => n.type === 'New Chat Message' && n.entityId === notification.entityId && !n.isRead);
        if (existingIdx !== -1) {
          state.items[existingIdx] = notification;
          return;
        }
      }

      state.items.unshift(notification);
      state.unreadCount += 1;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => { state.isLoading = true; })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.meta.arg?.page > 1) {
          state.items = [...state.items, ...action.payload.docs];
        } else {
          state.items = action.payload.docs;
        }
        state.pagination = { page: action.payload.page, totalPages: action.payload.totalPages };
      })
      
      // Unread Count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      
      // Mark Read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const item = state.items.find(n => n._id === action.payload);
        if (item && !item.isRead) {
          item.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      
      // Mark All Read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.items.forEach(item => { item.isRead = true; });
        state.unreadCount = 0;
      })
      
      // Delete
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const item = state.items.find(n => n._id === action.payload);
        if (item && !item.isRead) state.unreadCount = Math.max(0, state.unreadCount - 1);
        state.items = state.items.filter(n => n._id !== action.payload);
      })
      
      // Clear All
      .addCase(clearAllNotifications.fulfilled, (state) => {
        state.items = [];
        state.unreadCount = 0;
      });
  }
});

export const { receiveRealTimeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
