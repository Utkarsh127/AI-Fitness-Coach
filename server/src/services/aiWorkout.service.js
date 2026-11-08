/**
 * @module services/aiWorkout.service
 * @description Generates structured workout plans using Gemini AI.
 */

import * as aiService from './ai.service.js';
import * as aiContextService from './aiContext.service.js';
import Exercise from '../models/exercise.model.js';
import ApiError from '../utils/ApiError.js';
import stringSimilarity from 'string-similarity';

/**
 * Normalizes an exercise name for better matching.
 */
const normalizeName = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
};

/**
 * Fuzzy matches an AI-generated exercise name against available DB exercises.
 */
const matchExercise = (aiName, availableExercises) => {
  if (!aiName) return null;
  
  // Exact or near-exact match first
  const normalizedAi = normalizeName(aiName);
  let bestMatch = availableExercises.find(e => normalizeName(e.name) === normalizedAi);
  
  if (bestMatch) return bestMatch._id;

  // Fuzzy match using Dice's Coefficient (string-similarity)
  const exerciseNames = availableExercises.map(e => e.name);
  if (exerciseNames.length === 0) return null;

  const matches = stringSimilarity.findBestMatch(aiName, exerciseNames);
  if (matches.bestMatch.rating > 0.4) { // Acceptable threshold
    const matchDoc = availableExercises.find(e => e.name === matches.bestMatch.target);
    return matchDoc ? matchDoc._id : null;
  }
  
  return null;
};

const SYSTEM_INSTRUCTION = `
You are an expert AI Fitness Coach API.
Your ONLY output must be a valid JSON object representing a workout plan.
Do NOT include markdown wrapping like \`\`\`json. Output ONLY raw JSON.

Follow this EXACT schema:
{
  "name": "String",
  "description": "String",
  "goal": "String",
  "difficulty": "String (Beginner, Intermediate, Advanced, Elite)",
  "durationWeeks": Number,
  "daysPerWeek": Number,
  "estimatedSessionDuration": Number,
  "days": [
    {
      "dayNumber": Number,
      "title": "String",
      "focus": "String",
      "isRestDay": Boolean,
      "exercises": [
        {
          "exerciseName": "String (Must be a real exercise name)",
          "sets": Number,
          "reps": "String (e.g. 8-12, To failure, 10)",
          "restTime": Number (seconds),
          "weight": "String (e.g. Bodyweight, +20kg)",
          "intensity": "String",
          "tempo": "String",
          "notes": "String"
        }
      ]
    }
  ],
  "notes": "String"
}

Guidelines:
1. ONLY use exercises provided in the AVAILABLE EXERCISES list. DO NOT INVENT EXERCISES.
2. Adhere to the user's constraints (days per week, equipment, etc).
3. If isRestDay is true, exercises array must be empty.
`;

/**
 * Generates a structured workout plan using AI.
 * @param {string} userId - User requesting the plan.
 * @param {Object} preferences - e.g. goal, daysPerWeek, equipment, focus
 */
export const generateWorkoutPlan = async (userId, preferences) => {
  // 1. Build User Context
  const userContext = await aiContextService.buildUserContext(userId);

  // 2. Fetch Available Exercises (limit fields to save tokens)
  const availableExercises = await Exercise.find({ isActive: true })
    .select('name category difficulty equipment')
    .lean();

  if (availableExercises.length === 0) {
    throw new ApiError(500, 'Exercise library is empty. Cannot generate a plan.');
  }

  const exerciseListText = availableExercises
    .map(e => `- ${e.name} (${e.category}, ${e.difficulty})`)
    .join('\n');

  // 3. Construct Prompt
  const prompt = `
USER CONTEXT:
${userContext}

USER PREFERENCES / REQUEST:
${JSON.stringify(preferences, null, 2)}

AVAILABLE EXERCISES:
${exerciseListText}

Generate the JSON workout plan now.
`;

  // 4. Generate JSON
  let generatedData;
  try {
    generatedData = await aiService.generateJson({
      prompt,
      systemInstruction: SYSTEM_INSTRUCTION
    });
  } catch (error) {
    throw new ApiError(500, 'Failed to generate workout plan from AI.');
  }

  // 5. Validate & Map Exercise IDs
  if (!generatedData.days || !Array.isArray(generatedData.days)) {
    throw new ApiError(500, 'AI returned invalid workout structure (missing days).');
  }

  const validDays = [];
  
  for (const day of generatedData.days) {
    const validExercises = [];
    
    if (day.exercises && Array.isArray(day.exercises)) {
      for (const ex of day.exercises) {
        // Try to match AI exercise name to our DB
        const matchedId = matchExercise(ex.exerciseName, availableExercises);
        
        if (matchedId) {
          validExercises.push({
            exerciseId: matchedId,
            exerciseName: ex.exerciseName, // keep for frontend preview
            sets: ex.sets || 3,
            reps: ex.reps || "10",
            duration: ex.duration || null,
            restTime: ex.restTime || 90,
            weight: ex.weight || "Bodyweight",
            intensity: ex.intensity || "",
            tempo: ex.tempo || "",
            notes: ex.notes || ""
          });
        }
        // If no match found, skip it (dropping hallucinated exercises)
      }
    }
    
    validDays.push({
      dayNumber: day.dayNumber,
      title: day.title || `Day ${day.dayNumber}`,
      focus: day.focus || "",
      isRestDay: day.isRestDay || validExercises.length === 0,
      exercises: validExercises
    });
  }

  generatedData.days = validDays;

  return generatedData;
};
