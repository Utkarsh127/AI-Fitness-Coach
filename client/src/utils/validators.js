/**
 * @module utils/validators
 * @description Zod schemas for client-side form validation.
 */

import { z } from 'zod';

const passwordRules = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// ─── Auth schemas ──────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(60, 'Name cannot exceed 60 characters'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username cannot exceed 30 characters')
      .regex(/^[a-z0-9_]+$/, 'Only lowercase letters, numbers, and underscores'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: passwordRules,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

export const resetPasswordSchema = z
  .object({
    password: passwordRules,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordRules,
    confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

// ─── Profile & Onboarding schemas ─────────────────────────────────────────────

const GENDERS = ['male', 'female', 'other', 'prefer_not_to_say'];
const FITNESS_GOALS = ['Strength', 'Muscle Gain', 'Fat Loss', 'Endurance', 'Calisthenics', 'Hybrid Training', 'Aesthetic', 'General Fitness'];
const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const TRAINING_LOCATIONS = ['Home', 'Gym', 'Both', 'Outdoor'];
const EQUIPMENT_LIST = ['No Equipment', 'Pull-up Bar', 'Dip Bars', 'Resistance Bands', 'Dumbbells', 'Barbell', 'Bench', 'Kettlebell', 'Rings', 'Parallettes', 'Cable Machine', 'Other'];
const SKILL_LEVELS = ['notStarted', 'beginner', 'intermediate', 'advanced', 'achieved'];

export const onboardingSchema = z.object({
  age: z.coerce.number().min(10, 'Age must be at least 10').max(120, 'Age must be less than 120'),
  gender: z.enum(GENDERS, { required_error: 'Please select a gender' }),
  height: z.coerce.number().min(50, 'Height must be at least 50 cm').max(300, 'Height must be less than 300 cm'),
  weight: z.coerce.number().min(20, 'Weight must be at least 20 kg').max(400, 'Weight must be less than 400 kg'),
  bodyFatPercentage: z.coerce.number().min(2).max(70).optional().or(z.literal('')),
  
  fitnessGoal: z.array(z.enum(FITNESS_GOALS)).min(1, 'Select at least one goal'),
  experienceLevel: z.enum(EXPERIENCE_LEVELS, { required_error: 'Please select your experience level' }),
  
  trainingDaysPerWeek: z.coerce.number().min(1).max(7),
  preferredWorkoutDuration: z.coerce.number().min(10).max(180),
  trainingLocation: z.enum(TRAINING_LOCATIONS, { required_error: 'Please select a location' }),
  availableEquipment: z.array(z.enum(EQUIPMENT_LIST)),
  
  calisthenicsSkills: z.object({
    pushUps: z.enum(SKILL_LEVELS).default('notStarted'),
    pullUps: z.enum(SKILL_LEVELS).default('notStarted'),
    dips: z.enum(SKILL_LEVELS).default('notStarted'),
    handstandPushUps: z.enum(SKILL_LEVELS).default('notStarted'),
    muscleUps: z.enum(SKILL_LEVELS).default('notStarted'),
    lSit: z.enum(SKILL_LEVELS).default('notStarted'),
    pistolSquat: z.enum(SKILL_LEVELS).default('notStarted'),
    plank: z.enum(SKILL_LEVELS).default('notStarted'),
    frontLever: z.enum(SKILL_LEVELS).default('notStarted'),
    planche: z.enum(SKILL_LEVELS).default('notStarted'),
  }).optional(),
});

export const profileSchema = onboardingSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
  username: z.string().min(3).max(30).regex(/^[a-z0-9_]+$/, 'Only lowercase letters, numbers, and underscores'),
  bio: z.string().max(200, 'Bio cannot exceed 200 characters').optional().or(z.literal('')),
});

// ─── Future schemas (stubs, completed in later prompts) ───────────────────────
export const workoutSchema = z.object({});
export const nutritionSchema = z.object({});
export const postSchema = z.object({});
