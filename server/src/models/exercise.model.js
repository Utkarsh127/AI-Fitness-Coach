/**
 * @module models/exercise.model
 * @description Mongoose schema for the Exercise Library.
 */

import mongoose from 'mongoose';

const EXERCISE_CATEGORIES = [
  'Calisthenics', 'Strength Training', 'Hybrid', 'Mobility', 'Conditioning'
];

const DIFFICULTY_LEVELS = [
  'Beginner', 'Intermediate', 'Advanced', 'Elite'
];

const EXERCISE_TYPES = [
  'Strength', 'Hypertrophy', 'Endurance', 'Skill', 'Mobility', 'Conditioning', 'Recovery'
];

const EQUIPMENT_LIST = [
  'No Equipment', 'Pull-up Bar', 'Dip Bars', 'Resistance Bands', 'Dumbbells', 
  'Barbell', 'Bench', 'Kettlebell', 'Rings', 'Parallettes', 'Cable Machine', 'Other'
];

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    detailedDescription: {
      type: String,
    },
    expectedImprovements: {
      type: String,
    },
    benefits: [{
      type: String,
    }],
    programming: {
      beginner: {
        sets: String,
        reps: String,
        rest: String,
        variation: String,
      },
      intermediate: {
        sets: String,
        reps: String,
        rest: String,
        variation: String,
      },
      advanced: {
        sets: String,
        reps: String,
        rest: String,
        variation: String,
      },
    },
    progressionSteps: [{
      level: Number,
      title: String,
    }],
    category: {
      type: String,
      enum: EXERCISE_CATEGORIES,
      required: true,
    },
    difficulty: {
      type: String,
      enum: DIFFICULTY_LEVELS,
      required: true,
    },
    exerciseType: {
      type: String,
      enum: EXERCISE_TYPES,
      required: true,
    },
    muscleGroups: [{
      type: String,
      required: true,
    }],
    primaryMuscles: [{
      type: String,
    }],
    secondaryMuscles: [{
      type: String,
    }],
    equipment: [{
      type: String,
      enum: EQUIPMENT_LIST,
    }],
    movementPattern: {
      type: String, // e.g., 'Vertical Pull', 'Horizontal Push', 'Hinge'
      trim: true,
    },
    instructions: [{
      type: String,
      required: true,
    }],
    safetyTips: [{
      type: String,
    }],
    commonMistakes: [{
      type: String,
    }],
    progressionExercises: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
    }],
    regressionExercises: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
    }],
    videoUrl: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for text search and efficient filtering
exerciseSchema.index({ name: 'text', description: 'text' });
exerciseSchema.index({ category: 1 });
exerciseSchema.index({ difficulty: 1 });
exerciseSchema.index({ muscleGroups: 1 });

const Exercise = mongoose.model('Exercise', exerciseSchema);
export default Exercise;
