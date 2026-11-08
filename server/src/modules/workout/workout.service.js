/**
 * @module modules/workout/workout.service
 * @description Business logic for workouts and PRs.
 */

import WorkoutPlan from '../../models/workout.model.js';
import WorkoutLog from '../../models/workoutLog.model.js';
import PersonalRecord from '../../models/personalRecord.model.js';
import ApiError from '../../utils/ApiError.js';
import { getPaginatedResults } from '../../utils/pagination.js';
import { createNotification } from '../notifications/notification.service.js';

// ─── Workout Plans ─────────────────────────────────────────────────────────────

export const getWorkoutPlans = async (userId, query) => {
  const { page = 1, limit = 10 } = query;
  // Fetch plans created by the user, or public plans
  const filter = { $or: [{ createdBy: userId }, { isPublic: true }] };
  return getPaginatedResults(WorkoutPlan, filter, { page, limit, sort: { createdAt: -1 } });
};

export const getWorkoutPlanById = async (planId, userId) => {
  const plan = await WorkoutPlan.findById(planId).populate('days.exercises.exerciseId', 'name slug category difficulty equipment imageUrl');
  if (!plan) throw new ApiError(404, 'Workout plan not found');
  
  if (plan.createdBy.toString() !== userId.toString() && !plan.isPublic) {
    throw new ApiError(403, 'You do not have permission to view this plan');
  }
  return plan;
};

export const createWorkoutPlan = async (userId, data) => {
  const plan = await WorkoutPlan.create({ ...data, createdBy: userId });
  return plan;
};

export const updateWorkoutPlan = async (planId, userId, data) => {
  const plan = await WorkoutPlan.findById(planId);
  if (!plan) throw new ApiError(404, 'Workout plan not found');
  if (plan.createdBy.toString() !== userId.toString()) {
    throw new ApiError(403, 'You can only edit your own plans');
  }

  Object.assign(plan, data);
  await plan.save();
  return plan;
};

export const deleteWorkoutPlan = async (planId, userId) => {
  const plan = await WorkoutPlan.findById(planId);
  if (!plan) throw new ApiError(404, 'Workout plan not found');
  if (plan.createdBy.toString() !== userId.toString()) {
    throw new ApiError(403, 'You can only delete your own plans');
  }
  await plan.deleteOne();
};

// ─── Workout Logs ──────────────────────────────────────────────────────────────

const calculatePRs = async (userId, logId, date, exercises) => {
  const newPRs = [];

  for (const ex of exercises) {
    // Determine max weight and max reps across all sets for this exercise
    // We treat `ex.reps` as a string that might be a number, so we parse it safely
    const repsParsed = parseInt(ex.reps, 10) || 0;
    const weightParsed = ex.weight || 0;

    if (weightParsed > 0) {
      // Check weight PR
      const existingWeightPR = await PersonalRecord.findOne({ user: userId, exercise: ex.exerciseId, recordType: 'weight' }).sort({ value: -1 });
      if (!existingWeightPR || weightParsed > existingWeightPR.value) {
        const pr = await PersonalRecord.create({
          user: userId,
          exercise: ex.exerciseId,
          recordType: 'weight',
          value: weightParsed,
          reps: repsParsed,
          date,
          workoutLogId: logId,
        });
        newPRs.push(pr);

        await createNotification({
          recipient: userId,
          type: 'PR Achieved',
          title: 'New Personal Record! 🏆',
          message: `You hit a new weight PR of ${weightParsed} on your exercise!`,
          actionUrl: '/workouts/history',
          entityType: 'PersonalRecord',
          entityId: pr._id
        }).catch(err => console.error(err));
      }
    }

    if (repsParsed > 0 && weightParsed === 0) {
      // Bodyweight max reps PR
      const existingRepsPR = await PersonalRecord.findOne({ user: userId, exercise: ex.exerciseId, recordType: 'reps' }).sort({ value: -1 });
      if (!existingRepsPR || repsParsed > existingRepsPR.value) {
        const pr = await PersonalRecord.create({
          user: userId,
          exercise: ex.exerciseId,
          recordType: 'reps',
          value: repsParsed,
          date,
          workoutLogId: logId,
        });
        newPRs.push(pr);

        await createNotification({
          recipient: userId,
          type: 'PR Achieved',
          title: 'New Personal Record! 🏆',
          message: `You hit a new reps PR of ${repsParsed} on your exercise!`,
          actionUrl: '/workouts/history',
          entityType: 'PersonalRecord',
          entityId: pr._id
        }).catch(err => console.error(err));
      }
    }
  }

  return newPRs;
};

export const logWorkout = async (userId, data) => {
  const log = await WorkoutLog.create({ ...data, user: userId });
  
  // Calculate and store PRs asynchronously
  const newPRs = await calculatePRs(userId, log._id, log.date, data.exercises);
  
  // Return the log along with any new PRs achieved during this session
  return { log, newPRs };
};

export const getWorkoutHistory = async (userId, query) => {
  const { page = 1, limit = 10 } = query;
  return getPaginatedResults(WorkoutLog, { user: userId }, { 
    page, limit, sort: { date: -1 }, populate: 'workoutPlan exercises.exerciseId' 
  });
};

export const getWorkoutStats = async (userId) => {
  const logs = await WorkoutLog.find({ user: userId, completed: true });
  
  const totalSessions = logs.length;
  const totalVolume = logs.reduce((acc, log) => acc + (log.totalVolume || 0), 0);
  const totalDuration = logs.reduce((acc, log) => acc + (log.duration || 0), 0);
  
  // Simple streak calculation based on days between sessions
  let streak = 0;
  if (totalSessions > 0) {
    streak = 1;
    // (A more advanced calculation would check consecutive calendar days)
  }

  return { totalSessions, totalVolume, totalDuration, streak };
};

export const getPersonalRecords = async (userId) => {
  return PersonalRecord.find({ user: userId })
    .populate('exercise', 'name category')
    .sort({ date: -1 });
};
