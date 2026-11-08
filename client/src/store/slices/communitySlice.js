/**
 * @module store/slices/communitySlice
 * @description Redux slice for the Community Feed and Interactions.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import * as communityApi from '../../api/community.api.js';

export const fetchFeed = createAsyncThunk('community/fetchFeed', async (params, { rejectWithValue }) => {
  try {
    const res = await communityApi.getFeed(params);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch feed');
  }
});

export const fetchPostDetails = createAsyncThunk('community/fetchPostDetails', async (postId, { rejectWithValue }) => {
  try {
    const res = await communityApi.getPostById(postId);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch post');
  }
});

export const fetchPostComments = createAsyncThunk('community/fetchPostComments', async (postId, { rejectWithValue }) => {
  try {
    const res = await communityApi.getComments(postId);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch comments');
  }
});

export const createPost = createAsyncThunk('community/createPost', async (formData, { rejectWithValue }) => {
  try {
    const res = await communityApi.createPost(formData);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create post');
  }
});

export const deletePost = createAsyncThunk('community/deletePost', async (postId, { rejectWithValue }) => {
  try {
    await communityApi.deletePost(postId);
    return postId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete post');
  }
});

// Using createAsyncThunk for interactions, but we'll also optimistically update the state
export const toggleLike = createAsyncThunk('community/toggleLike', async ({ postId, userId }, { rejectWithValue }) => {
  try {
    const res = await communityApi.toggleLike(postId);
    return { postId, likes: res.data.data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to like');
  }
});

export const toggleBookmark = createAsyncThunk('community/toggleBookmark', async ({ postId, userId }, { rejectWithValue }) => {
  try {
    const res = await communityApi.toggleBookmark(postId);
    return { postId, bookmarks: res.data.data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to bookmark');
  }
});

export const addComment = createAsyncThunk('community/addComment', async ({ postId, data }, { rejectWithValue }) => {
  try {
    const res = await communityApi.addComment(postId, data);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add comment');
  }
});

export const deleteComment = createAsyncThunk('community/deleteComment', async (commentId, { rejectWithValue }) => {
  try {
    await communityApi.deleteComment(commentId);
    return commentId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete comment');
  }
});

const initialState = {
  posts: [],
  pagination: { page: 1, totalPages: 1 },
  currentPost: null,
  currentComments: [],
  savedPosts: [],
  userPosts: [],
  isLoading: false,
  error: null,
};

const updatePostInState = (state, postId, updates) => {
  const postInFeed = state.posts.find(p => p._id === postId);
  if (postInFeed) Object.assign(postInFeed, updates);
  
  if (state.currentPost && state.currentPost._id === postId) {
    Object.assign(state.currentPost, updates);
  }
  
  const postInUser = state.userPosts.find(p => p._id === postId);
  if (postInUser) Object.assign(postInUser, updates);

  const postInSaved = state.savedPosts.find(p => p._id === postId);
  if (postInSaved) Object.assign(postInSaved, updates);
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    clearCurrentPost: (state) => {
      state.currentPost = null;
      state.currentComments = [];
      state.error = null;
    },
    optimisticLike: (state, action) => {
      const { postId, userId } = action.payload;
      const post = state.posts.find(p => p._id === postId) 
        || state.userPosts.find(p => p._id === postId) 
        || state.savedPosts.find(p => p._id === postId) 
        || (state.currentPost?._id === postId ? state.currentPost : null);
        
      if (post) {
        const hasLiked = post.likes.includes(userId);
        const newLikes = hasLiked 
          ? post.likes.filter(id => id !== userId) 
          : [...post.likes, userId];
        updatePostInState(state, postId, { likes: newLikes });
      }
    },
    optimisticBookmark: (state, action) => {
      const { postId, userId } = action.payload;
      const post = state.posts.find(p => p._id === postId) 
        || state.userPosts.find(p => p._id === postId) 
        || state.savedPosts.find(p => p._id === postId) 
        || (state.currentPost?._id === postId ? state.currentPost : null);
        
      if (post) {
        const hasBookmarked = post.bookmarks.includes(userId);
        const newBookmarks = hasBookmarked 
          ? post.bookmarks.filter(id => id !== userId) 
          : [...post.bookmarks, userId];
          
        updatePostInState(state, postId, { bookmarks: newBookmarks });
        
        // If unsaving, remove it immediately from the savedPosts view if present
        if (hasBookmarked) {
          state.savedPosts = state.savedPosts.filter(p => p._id !== postId);
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Feed
      .addCase(fetchFeed.pending, (state) => { state.isLoading = true; })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        // Simple replace for now, infinite scroll could use append
        if (action.payload.page === 1) {
          state.posts = action.payload.docs;
        } else {
          state.posts = [...state.posts, ...action.payload.docs];
        }
        state.pagination = { page: action.payload.page, totalPages: action.payload.totalPages };
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Post Details
      .addCase(fetchPostDetails.pending, (state) => { 
        state.isLoading = true; 
        state.error = null;
      })
      .addCase(fetchPostDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch post';
      })
      // Comments
      .addCase(fetchPostComments.fulfilled, (state, action) => {
        state.currentComments = action.payload;
      })
      // Create Post
      .addCase(createPost.pending, (state) => { state.isLoading = true; })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts.unshift(action.payload);
        toast.success('Post created successfully!');
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload || 'Failed to create post');
      })
      // Delete Post
      .addCase(deletePost.fulfilled, (state, action) => {
        const postId = action.payload;
        state.posts = state.posts.filter(p => p._id !== postId);
        state.userPosts = state.userPosts.filter(p => p._id !== postId);
        state.savedPosts = state.savedPosts.filter(p => p._id !== postId);
        if (state.currentPost?._id === postId) {
          state.currentPost = null;
          state.currentComments = [];
        }
        toast.success('Post deleted');
      })
      // Server responses for likes/bookmarks (reconciles optimistic updates)
      .addCase(toggleLike.fulfilled, (state, action) => {
        updatePostInState(state, action.payload.postId, { likes: action.payload.likes });
      })
      .addCase(toggleBookmark.fulfilled, (state, action) => {
        updatePostInState(state, action.payload.postId, { bookmarks: action.payload.bookmarks });
      })
      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        const comment = action.payload;
        if (!comment.parentComment) {
          state.currentComments.unshift({ ...comment, replies: [] });
        } else {
          const parent = state.currentComments.find(c => c._id === comment.parentComment);
          if (parent) {
            parent.replies.push(comment);
          }
        }
        // Increment count
        if (state.currentPost) state.currentPost.commentsCount += 1;
        updatePostInState(state, comment.post, { 
          commentsCount: (state.posts.find(p => p._id === comment.post)?.commentsCount || 0) + 1 
        });
      })
      // Delete Comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const id = action.payload;
        let found = false;
        
        // Remove from root comments
        const initialLength = state.currentComments.length;
        state.currentComments = state.currentComments.filter(c => c._id !== id);
        if (state.currentComments.length !== initialLength) {
          found = true;
        } else {
          // Remove from replies
          state.currentComments.forEach(c => {
            if (c.replies) {
              const rLength = c.replies.length;
              c.replies = c.replies.filter(r => r._id !== id);
              if (c.replies.length !== rLength) found = true;
            }
          });
        }
        
        if (found) {
          if (state.currentPost) {
            state.currentPost.commentsCount = Math.max(0, state.currentPost.commentsCount - 1);
            updatePostInState(state, state.currentPost._id, { 
              commentsCount: state.currentPost.commentsCount 
            });
          }
        }
        toast.success('Comment deleted');
      });
  }
});

export const { clearCurrentPost, optimisticLike, optimisticBookmark } = communitySlice.actions;
export default communitySlice.reducer;
