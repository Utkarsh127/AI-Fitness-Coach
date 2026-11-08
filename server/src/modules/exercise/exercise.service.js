/**
 * @module modules/exercise/exercise.service
 * @description Business logic for Exercise Library.
 */

import Exercise from '../../models/exercise.model.js';
import ApiError from '../../utils/ApiError.js';
import { getPaginatedResults } from '../../utils/pagination.js';

export const getExercises = async (query) => {
  const { page = 1, limit = 10, search, category, difficulty, muscle, equipment } = query;
  const filter = { isActive: true };

  if (search) {
    filter.$text = { $search: search };
  }
  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;
  if (muscle) filter.muscleGroups = { $in: [muscle] };
  if (equipment) filter.equipment = { $in: [equipment] };

  // Sort by text score if searching, otherwise alphabetically
  const sort = search ? { score: { $meta: 'textScore' } } : { name: 1 };

  return getPaginatedResults(Exercise, filter, { page, limit, sort });
};

export const getExerciseById = async (id) => {
  const exercise = await Exercise.findById(id)
    .populate('progressionExercises', 'name slug difficulty')
    .populate('regressionExercises', 'name slug difficulty');
  if (!exercise) throw new ApiError(404, 'Exercise not found');
  return exercise;
};

export const getExerciseBySlug = async (slug) => {
  const exercise = await Exercise.findOne({ slug })
    .populate('progressionExercises', 'name slug difficulty')
    .populate('regressionExercises', 'name slug difficulty');
  if (!exercise) throw new ApiError(404, 'Exercise not found');
  return exercise;
};

export const createExercise = async (data) => {
  const existing = await Exercise.findOne({ slug: data.slug });
  if (existing) throw new ApiError(409, 'Exercise with this slug already exists');
  return Exercise.create(data);
};

export const updateExercise = async (id, data) => {
  if (data.slug) {
    const existing = await Exercise.findOne({ slug: data.slug, _id: { $ne: id } });
    if (existing) throw new ApiError(409, 'Exercise with this slug already exists');
  }
  const exercise = await Exercise.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!exercise) throw new ApiError(404, 'Exercise not found');
  return exercise;
};

export const deleteExercise = async (id) => {
  // Soft delete
  const exercise = await Exercise.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!exercise) throw new ApiError(404, 'Exercise not found');
  return exercise;
};
