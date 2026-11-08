/**
 * @module models/post.model
 * @description Mongoose schema for Community Posts.
 */

import mongoose from 'mongoose';

const POST_TYPES = [
  'Workout', 'Progress Photo', 'Transformation', 'Achievement',
  'Question', 'General Fitness', 'Nutrition', 'Mobility', 
  'Challenge', 'Calisthenics', 'Hybrid Training'
];

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    postType: {
      type: String,
      enum: POST_TYPES,
      required: true,
      default: 'General Fitness',
      index: true,
    },
    caption: {
      type: String,
      trim: true,
      maxLength: 2000, // Instagram-like limit
    },
    images: [{
      type: String, // Cloudinary URLs
    }],
    videos: [{
      type: String, // Cloudinary URLs (future ready)
    }],
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    mentionedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    visibility: {
      type: String,
      enum: ['Public', 'Followers', 'Private'],
      default: 'Public',
      index: true,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    bookmarks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    commentsCount: {
      type: Number,
      default: 0,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
      trim: true,
    },
    workoutReference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkoutLog', // Optional ref to a completed workout
    },
    progressReference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PersonalRecord', // Optional ref to an achievement/PR
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 }); // For main feed
postSchema.index({ tags: 1 });
postSchema.index({ caption: 'text' }); // Text search

const Post = mongoose.model('Post', postSchema);
export default Post;
