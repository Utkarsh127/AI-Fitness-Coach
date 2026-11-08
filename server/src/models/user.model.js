/**
 * @module models/user.model
 * @description Mongoose schema/model for platform users.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';

// Enums for standardising inputs
const GENDERS = ['male', 'female', 'other', 'prefer_not_to_say'];
const FITNESS_GOALS = ['Strength', 'Muscle Gain', 'Fat Loss', 'Endurance', 'Calisthenics', 'Hybrid Training', 'Aesthetic', 'General Fitness'];
const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const TRAINING_LOCATIONS = ['Home', 'Gym', 'Both', 'Outdoor'];
const EQUIPMENT_LIST = ['No Equipment', 'Pull-up Bar', 'Dip Bars', 'Resistance Bands', 'Dumbbells', 'Barbell', 'Bench', 'Kettlebell', 'Rings', 'Parallettes', 'Cable Machine', 'Other'];
const SKILL_LEVELS = ['notStarted', 'beginner', 'intermediate', 'advanced', 'achieved'];

const calisthenicsSkillSchema = new mongoose.Schema({
  pushUps: { type: String, enum: SKILL_LEVELS, default: 'notStarted' },
  pullUps: { type: String, enum: SKILL_LEVELS, default: 'notStarted' },
  dips: { type: String, enum: SKILL_LEVELS, default: 'notStarted' },
  handstandPushUps: { type: String, enum: SKILL_LEVELS, default: 'notStarted' },
  muscleUps: { type: String, enum: SKILL_LEVELS, default: 'notStarted' },
  lSit: { type: String, enum: SKILL_LEVELS, default: 'notStarted' },
  pistolSquat: { type: String, enum: SKILL_LEVELS, default: 'notStarted' },
  plank: { type: String, enum: SKILL_LEVELS, default: 'notStarted' },
  frontLever: { type: String, enum: SKILL_LEVELS, default: 'notStarted' },
  planche: { type: String, enum: SKILL_LEVELS, default: 'notStarted' },
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    // ─── Identity ──────────────────────────────────────────────────────────────
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      maxlength: [200, 'Bio cannot exceed 200 characters'],
      default: '',
    },

    // ─── Basic Info (Onboarding Step 1) ────────────────────────────────────────
    age: {
      type: Number,
      min: [10, 'Age must be at least 10'],
      max: [120, 'Age must be less than 120'],
    },
    gender: {
      type: String,
      enum: GENDERS,
    },

    // ─── Physical Info (Onboarding Step 2) - Metric (cm/kg) ────────────────────
    height: {
      type: Number, // in cm
      min: [50, 'Height must be at least 50 cm'],
      max: [300, 'Height must be less than 300 cm'],
    },
    weight: {
      type: Number, // in kg
      min: [20, 'Weight must be at least 20 kg'],
      max: [400, 'Weight must be less than 400 kg'],
    },
    bodyFatPercentage: {
      type: Number,
      min: [2, 'Body fat percentage must be at least 2%'],
      max: [70, 'Body fat percentage must be less than 70%'],
    },

    // ─── Fitness Info (Onboarding Steps 3, 4, 5) ───────────────────────────────
    fitnessGoal: [{
      type: String,
      enum: FITNESS_GOALS,
    }],
    experienceLevel: {
      type: String,
      enum: EXPERIENCE_LEVELS,
    },
    trainingDaysPerWeek: {
      type: Number,
      min: [1, 'Training days must be at least 1'],
      max: [7, 'Training days cannot exceed 7'],
    },
    preferredWorkoutDuration: {
      type: Number, // in minutes
      min: [10, 'Workout duration must be at least 10 minutes'],
      max: [180, 'Workout duration cannot exceed 180 minutes'],
    },
    trainingLocation: {
      type: String,
      enum: TRAINING_LOCATIONS,
    },
    availableEquipment: [{
      type: String,
      enum: EQUIPMENT_LIST,
    }],

    // ─── Calisthenics Skills (Onboarding Step 6) ───────────────────────────────
    calisthenicsSkills: {
      type: calisthenicsSkillSchema,
      default: () => ({}),
    },

    // ─── Roles & Status ────────────────────────────────────────────────────────
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    hasCompletedOnboarding: { type: Boolean, default: false },

    // ─── Auth tokens ───────────────────────────────────────────────────────────
    refreshToken: { type: String, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Removed duplicate indexes since unique: true is defined in schema

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return signAccessToken({ id: this._id.toString(), role: this.role });
};

userSchema.methods.generateRefreshToken = function () {
  return signRefreshToken({ id: this._id.toString() });
};

userSchema.methods.createPasswordResetToken = function () {
  const rawToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return rawToken;
};

userSchema.statics.hashRefreshToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

userSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.password;
    delete ret.refreshToken;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    return ret;
  },
});

const User = mongoose.model('User', userSchema);
export default User;
