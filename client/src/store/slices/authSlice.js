/**
 * @module store/slices/authSlice
 * @description Redux slice for authentication state.
 *
 * State shape:
 *  {
 *    user: object | null,
 *    isAuthenticated: boolean,
 *    isLoading: boolean,
 *    isInitialising: boolean,   ← true while checkAuth is running on mount
 *    error: string | null,
 *  }
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import * as authApi from '../../api/auth.api.js';
import tokenService from '../../services/tokenService.js';

// ─── Async Thunks ─────────────────────────────────────────────────────────────

/** Register a new user. */
export const registerUser = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.register(data);
      const { user, accessToken } = res.data.data;
      tokenService.setToken(accessToken);
      return user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    }
  }
);

/** Login with email and password. */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await authApi.login(credentials);
      const { user, accessToken } = res.data.data;
      tokenService.setToken(accessToken);
      return user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    }
  }
);

/** Logout the current user. */
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      tokenService.clearToken();
    } catch {
      // Clear client-side state even if server call fails
      tokenService.clearToken();
      rejectWithValue(null);
    }
  }
);

/**
 * Check if a valid session exists on app mount.
 * Calls /auth/refresh (uses httpOnly cookie) to get a new access token.
 * This is how authentication persists across page reloads.
 */
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const refreshRes = await authApi.refreshToken();
      const { accessToken } = refreshRes.data.data;
      tokenService.setToken(accessToken);

      // Now fetch the user
      const meRes = await authApi.getMe();
      return meRes.data.data.user;
    } catch {
      tokenService.clearToken();
      return rejectWithValue(null);
    }
  }
);

/** Get the current authenticated user. */
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.getMe();
      return res.data.data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch user.'
      );
    }
  }
);

/** Change password. */
export const changeUserPassword = createAsyncThunk(
  'auth/changePassword',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      await authApi.changePassword(data);
      // Server invalidates session; clear client state
      tokenService.clearToken();
      dispatch(authSlice.actions.clearUser());
      return null;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to change password.'
      );
    }
  }
);

/** Forgot password — sends reset email. */
export const forgotUserPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const res = await authApi.forgotPassword(email);
      return res.data.message;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to send reset email.'
      );
    }
  }
);

/** Reset password using token from email. */
export const resetUserPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const res = await authApi.resetPassword(token, data);
      return res.data.message;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to reset password.'
      );
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────────────────────

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialising: true, // True until checkAuth completes on mount
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Clear error state (e.g., when navigating away from auth page). */
    clearError(state) {
      state.error = null;
    },
    /** Immediately clear user from state (used by Axios logout event). */
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ─── checkAuth ───────────────────────────────────────────────────────────
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isInitialising = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isInitialising = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isInitialising = false;
        state.isAuthenticated = false;
        state.user = null;
      });

    // ─── registerUser ─────────────────────────────────────────────────────────
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        toast.success('Welcome! Your account has been created.');
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Registration failed.');
      });

    // ─── loginUser ────────────────────────────────────────────────────────────
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        toast.success(`Welcome back, ${action.payload.name}!`);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Login failed.');
      });

    // ─── logoutUser ───────────────────────────────────────────────────────────
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
        toast.success('You have been logged out.');
      })
      .addCase(logoutUser.rejected, (state) => {
        // Still clear client state even on server error
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      });

    // ─── getCurrentUser ───────────────────────────────────────────────────────
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ─── changeUserPassword ───────────────────────────────────────────────────
    builder
      .addCase(changeUserPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changeUserPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        toast.success('Password changed. Please log in again.');
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Failed to change password.');
      });

    // ─── forgotUserPassword ───────────────────────────────────────────────────
    builder
      .addCase(forgotUserPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotUserPassword.fulfilled, (state) => {
        state.isLoading = false;
        toast.success('If that email exists, a reset link has been sent.');
      })
      .addCase(forgotUserPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Failed to send reset email.');
      });

    // ─── resetUserPassword ────────────────────────────────────────────────────
    builder
      .addCase(resetUserPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetUserPassword.fulfilled, (state) => {
        state.isLoading = false;
        toast.success('Password reset successfully. Please log in.');
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Failed to reset password.');
      });
  },
});

export const { clearError, clearUser } = authSlice.actions;

// ─── Selectors ─────────────────────────────────────────────────────────────────
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectIsInitialising = (state) => state.auth.isInitialising;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
