/**
 * @module modules/user/user.validator
 * @description express-validator rule chains for user/profile routes.
 */

import { body } from 'express-validator';

const GENDERS = ['male', 'female', 'other', 'prefer_not_to_say'];
const FITNESS_GOALS = ['Strength', 'Muscle Gain', 'Fat Loss', 'Endurance', 'Calisthenics', 'Hybrid Training', 'Aesthetic', 'General Fitness'];
const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const TRAINING_LOCATIONS = ['Home', 'Gym', 'Both', 'Outdoor'];
const EQUIPMENT_LIST = ['No Equipment', 'Pull-up Bar', 'Dip Bars', 'Resistance Bands', 'Dumbbells', 'Barbell', 'Bench', 'Kettlebell', 'Rings', 'Parallettes', 'Cable Machine', 'Other'];
const SKILL_LEVELS = ['notStarted', 'beginner', 'intermediate', 'advanced', 'achieved'];

const validateSkills = () => {
  const skills = ['pushUps', 'pullUps', 'dips', 'handstandPushUps', 'muscleUps', 'lSit', 'pistolSquat', 'plank', 'frontLever', 'planche'];
  return skills.map(skill => 
    body(`calisthenicsSkills.${skill}`)
      .optional()
      .isIn(SKILL_LEVELS).withMessage(`Invalid skill level for ${skill}`)
  );
};

export const onboardingValidator = [
  body('age').notEmpty().withMessage('Age is required')
    .isInt({ min: 10, max: 120 }).withMessage('Age must be between 10 and 120'),
  body('gender').notEmpty().withMessage('Gender is required')
    .isIn(GENDERS).withMessage('Invalid gender selection'),
  
  body('height').notEmpty().withMessage('Height is required')
    .isFloat({ min: 50, max: 300 }).withMessage('Height must be between 50 and 300 cm'),
  body('weight').notEmpty().withMessage('Weight is required')
    .isFloat({ min: 20, max: 400 }).withMessage('Weight must be between 20 and 400 kg'),
  body('bodyFatPercentage').optional({ checkFalsy: true })
    .isFloat({ min: 2, max: 70 }).withMessage('Body fat must be between 2 and 70%'),

  body('fitnessGoal').isArray({ min: 1 }).withMessage('Select at least one fitness goal')
    .custom((goals) => goals.every(g => FITNESS_GOALS.includes(g))).withMessage('Invalid fitness goal selected'),
  body('experienceLevel').notEmpty().withMessage('Experience level is required')
    .isIn(EXPERIENCE_LEVELS).withMessage('Invalid experience level'),
  
  body('trainingDaysPerWeek').notEmpty().withMessage('Training days per week is required')
    .isInt({ min: 1, max: 7 }).withMessage('Training days must be between 1 and 7'),
  body('preferredWorkoutDuration').notEmpty().withMessage('Preferred workout duration is required')
    .isInt({ min: 10, max: 180 }).withMessage('Workout duration must be between 10 and 180 minutes'),
  body('trainingLocation').notEmpty().withMessage('Training location is required')
    .isIn(TRAINING_LOCATIONS).withMessage('Invalid training location'),
  body('availableEquipment').isArray().withMessage('Available equipment must be an array')
    .custom((eq) => eq.every(e => EQUIPMENT_LIST.includes(e))).withMessage('Invalid equipment selected'),

  ...validateSkills()
];

export const updateProfileValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 60 }).withMessage('Name must be between 2 and 60 characters'),
  body('username').optional().trim().isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-z0-9_]+$/).withMessage('Username can only contain lowercase letters, numbers, and underscores'),
  body('bio').optional({ checkFalsy: true }).trim().isLength({ max: 200 }).withMessage('Bio cannot exceed 200 characters'),
  
  body('age').optional().isInt({ min: 10, max: 120 }).withMessage('Age must be between 10 and 120'),
  body('gender').optional().isIn(GENDERS).withMessage('Invalid gender selection'),
  
  body('height').optional().isFloat({ min: 50, max: 300 }).withMessage('Height must be between 50 and 300 cm'),
  body('weight').optional().isFloat({ min: 20, max: 400 }).withMessage('Weight must be between 20 and 400 kg'),
  body('bodyFatPercentage').optional({ checkFalsy: true }).isFloat({ min: 2, max: 70 }).withMessage('Body fat must be between 2 and 70%'),

  body('fitnessGoal').optional().isArray({ min: 1 }).withMessage('Select at least one fitness goal')
    .custom((goals) => goals.every(g => FITNESS_GOALS.includes(g))).withMessage('Invalid fitness goal selected'),
  body('experienceLevel').optional().isIn(EXPERIENCE_LEVELS).withMessage('Invalid experience level'),
  
  body('trainingDaysPerWeek').optional().isInt({ min: 1, max: 7 }).withMessage('Training days must be between 1 and 7'),
  body('preferredWorkoutDuration').optional().isInt({ min: 10, max: 180 }).withMessage('Workout duration must be between 10 and 180 minutes'),
  body('trainingLocation').optional().isIn(TRAINING_LOCATIONS).withMessage('Invalid training location'),
  body('availableEquipment').optional().isArray().withMessage('Available equipment must be an array')
    .custom((eq) => eq.every(e => EQUIPMENT_LIST.includes(e))).withMessage('Invalid equipment selected'),

  ...validateSkills()
];
