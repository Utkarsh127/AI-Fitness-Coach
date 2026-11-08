/**
 * @module services/aiContext.service
 * @description Retrieves and compacts user data to provide context for the AI.
 */

import User from '../models/user.model.js';
import Workout from '../models/workout.model.js';
import WorkoutLog from '../models/workoutLog.model.js';
import PersonalRecord from '../models/personalRecord.model.js';

/**
 * Builds a compact text context containing relevant user fitness data.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<string>} The formatted context string.
 */
export const buildUserContext = async (userId) => {
  try {
    // 1. Fetch User Profile
    const user = await User.findById(userId).lean();
    if (!user) return 'User profile not found.';

    let context = '### USER PROFILE ###\n';
    if (user.age) context += `- Age: ${user.age}\n`;
    if (user.height) context += `- Height: ${user.height} cm\n`;
    if (user.weight) context += `- Weight: ${user.weight} kg\n`;
    if (user.experienceLevel) context += `- Experience: ${user.experienceLevel}\n`;
    if (user.fitnessGoal?.length) context += `- Goals: ${user.fitnessGoal.join(', ')}\n`;
    if (user.availableEquipment?.length) context += `- Equipment: ${user.availableEquipment.join(', ')}\n`;
    if (user.trainingDaysPerWeek) context += `- Training Days/Week: ${user.trainingDaysPerWeek}\n`;
    
    // Add calisthenics skills if any are better than notStarted
    if (user.calisthenicsSkills) {
      const skills = Object.entries(user.calisthenicsSkills)
        .filter(([_, level]) => level && level !== 'notStarted')
        .map(([skill, level]) => `${skill}: ${level}`);
      if (skills.length) {
        context += `- Calisthenics Skills: ${skills.join(', ')}\n`;
      }
    }

    // 2. Fetch Active Workout Plan
    const activeWorkout = await Workout.findOne({ user: userId, isActive: true })
      .select('title difficulty focusArea schedule')
      .lean();
    
    if (activeWorkout) {
      context += '\n### CURRENT WORKOUT PLAN ###\n';
      context += `- Title: ${activeWorkout.title}\n`;
      context += `- Difficulty: ${activeWorkout.difficulty}\n`;
      if (activeWorkout.focusArea?.length) {
        context += `- Focus: ${activeWorkout.focusArea.join(', ')}\n`;
      }
    }

    // 3. Fetch Recent Workout Logs
    const recentLogs = await WorkoutLog.find({ user: userId, isCompleted: true })
      .sort({ completedAt: -1 })
      .limit(3)
      .populate('workout', 'title')
      .select('workout duration caloriesBurned completedAt notes')
      .lean();

    if (recentLogs.length) {
      context += '\n### RECENT WORKOUTS (Last 3) ###\n';
      recentLogs.forEach((log) => {
        const title = log.workout?.title || 'Custom Workout';
        const date = log.completedAt ? new Date(log.completedAt).toISOString().split('T')[0] : 'Unknown date';
        context += `- [${date}] ${title} (${log.duration} mins). Notes: ${log.notes || 'None'}\n`;
      });
    }

    // 4. Fetch Personal Records
    const prs = await PersonalRecord.find({ user: userId })
      .sort({ achievedAt: -1 })
      .limit(10)
      .populate('exercise', 'name')
      .lean();

    if (prs.length) {
      context += '\n### TOP PERSONAL RECORDS (Recent) ###\n';
      prs.forEach((pr) => {
        const name = pr.exercise?.name || 'Unknown Exercise';
        const date = pr.achievedAt ? new Date(pr.achievedAt).toISOString().split('T')[0] : 'Unknown date';
        let stats = [];
        if (pr.value) stats.push(`Weight: ${pr.value}kg`);
        if (pr.reps) stats.push(`Reps: ${pr.reps}`);
        if (pr.duration) stats.push(`Time: ${pr.duration}s`);
        context += `- [${date}] ${name}: ${stats.join(', ')}\n`;
      });
    }

    return context;
  } catch (error) {
    console.error('Error building AI context:', error);
    return 'Context temporarily unavailable due to server error.';
  }
};
