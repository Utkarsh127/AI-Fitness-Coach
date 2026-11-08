/**
 * @module models/workoutLog.model
 * @description Mongoose schema for tracking completed workouts.
 */

import mongoose from 'mongoose';

const loggedExerciseSchema = new mongoose.Schema(
  {
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: true,
    },
    sets: {
      type: Number,
      required: true,
    },
    reps: {
      type: String,
      required: true,
    },
    weight: {
      type: Number, // In kg
    },
    duration: {
      type: Number, // In seconds
    },
    RPE: {
      type: Number, // Rate of Perceived Exertion (1-10)
      min: 1,
      max: 10,
    },
    notes: {
      type: String,
    },
  },
  { _id: false }
);

const workoutLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    workoutPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkoutPlan',
    },
    workoutDay: {
      type: mongoose.Schema.Types.ObjectId, // Ref to a specific day in the plan
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    duration: {
      type: Number, // In minutes
      required: true,
    },
    exercises: [loggedExerciseSchema],
    totalVolume: {
      type: Number, // Total kg lifted
      default: 0,
    },
    caloriesBurned: {
      type: Number,
    },
    notes: {
      type: String,
    },
    completed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

workoutLogSchema.index({ user: 1, date: -1 });

const WorkoutLog = mongoose.model('WorkoutLog', workoutLogSchema);
export default WorkoutLog;
