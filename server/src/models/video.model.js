/**
 * @module models/video.model
 * @description Mongoose schema for Fitness Learning Videos.
 */

import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    youtubeVideoId: {
      type: String,
      required: true,
      unique: true, // Prevent duplicate videos
    },
    thumbnail: {
      type: String,
    },
    duration: {
      type: Number, // In seconds
    },
    channelName: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'Handstand', 'Handstand Push-Up', 'Planche', 'Front Lever', 'Back Lever',
        'Muscle Up', 'Pull Ups', 'Dips', 'Push Ups', 'Core', 'Mobility', 
        'Stretching', 'Recovery', 'Nutrition', 'Strength', 'Hypertrophy', 
        'Fat Loss', 'Hybrid Training', 'Cardio', 'General'
      ],
      default: 'General',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'All Levels',
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    equipment: [{
      type: String,
      trim: true,
    }],
    skill: {
      type: String, // Specific skill targeted, e.g., 'Wall Handstand'
      trim: true,
    },
    estimatedLevel: {
      type: Number, // 1-10 numerical difficulty map for roadmaps
    },
    language: {
      type: String,
      default: 'English',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for fast searching and filtering
videoSchema.index({ category: 1, difficulty: 1 });
videoSchema.index({ title: 'text', description: 'text', tags: 'text', skill: 'text' });

const Video = mongoose.model('Video', videoSchema);
export default Video;
