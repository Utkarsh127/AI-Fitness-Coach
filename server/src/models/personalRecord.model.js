/**
 * @module models/personalRecord.model
 * @description Mongoose schema for tracking user PRs.
 */

import mongoose from 'mongoose';

const personalRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: true,
    },
    recordType: {
      type: String,
      enum: ['weight', 'reps', 'duration'],
      required: true,
    },
    value: {
      type: Number, // Numeric representation of the record (e.g., 100 for 100kg, 20 for 20 reps)
      required: true,
    },
    weight: {
      type: Number, // If recordType is 'reps', what weight was used?
    },
    reps: {
      type: Number, // If recordType is 'weight', how many reps?
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    workoutLogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkoutLog',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// A user should ideally only have one PR entry per exercise + recordType active,
// but we might want to keep a history. We'll use this index for fast lookups.
personalRecordSchema.index({ user: 1, exercise: 1, recordType: 1 });
personalRecordSchema.index({ user: 1, date: -1 });

const PersonalRecord = mongoose.model('PersonalRecord', personalRecordSchema);
export default PersonalRecord;
