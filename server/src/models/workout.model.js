/**
 * @module models/workout.model
 * @description Mongoose schema for Workout Plans.
 */

import mongoose from 'mongoose';

const workoutExerciseSchema = new mongoose.Schema(
  {
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: true,
    },
    sets: {
      type: Number,
      required: true,
      min: 1,
    },
    reps: {
      type: String, // Can be "8-12", "To failure", "10"
      required: true,
    },
    duration: {
      type: Number, // In seconds (for holds/planks)
    },
    restTime: {
      type: Number, // In seconds
      required: true,
      default: 90,
    },
    weight: {
      type: String, // e.g., "Bodyweight", "+20kg", "50% 1RM"
    },
    intensity: {
      type: String, // e.g., "RPE 8", "Light", "Hard"
    },
    tempo: {
      type: String, // e.g., "3-1-x-1"
    },
    notes: {
      type: String,
    },
  },
  { _id: true }
);

const workoutDaySchema = new mongoose.Schema(
  {
    dayNumber: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    focus: {
      type: String,
    },
    exercises: [workoutExerciseSchema],
    isRestDay: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const workoutPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    goal: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Elite'],
      required: true,
    },
    durationWeeks: {
      type: Number,
      required: true,
      min: 1,
    },
    daysPerWeek: {
      type: Number,
      required: true,
      min: 1,
      max: 7,
    },
    estimatedSessionDuration: {
      type: Number, // in minutes
    },
    days: [workoutDaySchema],
    notes: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

workoutPlanSchema.index({ createdBy: 1 });
workoutPlanSchema.index({ isPublic: 1 });

const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);
export default WorkoutPlan;
