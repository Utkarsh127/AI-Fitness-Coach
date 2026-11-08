/**
 * @module modules/user/user.service
 * @description Business logic for user profiles.
 */

import User from '../../models/user.model.js';
import ApiError from '../../utils/ApiError.js';
import cloudinary from '../../config/cloudinary.js';

// Calculate profile completion percentage based on key fields
export const calculateProfileCompletion = (user) => {
  const fields = [
    'name', 'username', 'email', 'age', 'gender', 'height', 'weight',
    'fitnessGoal', 'experienceLevel', 'trainingDaysPerWeek', 
    'preferredWorkoutDuration', 'trainingLocation', 'availableEquipment'
  ];
  
  let completed = 0;
  fields.forEach(field => {
    const val = user[field];
    if (val !== undefined && val !== null && val !== '') {
      // Arrays need to have at least one element
      if (Array.isArray(val)) {
        if (val.length > 0) completed++;
      } else {
        completed++;
      }
    }
  });

  return Math.round((completed / fields.length) * 100);
};

export const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  
  const completionPercentage = calculateProfileCompletion(user);
  
  // Return user doc as plain object to attach custom field
  const userObj = user.toJSON();
  userObj.profileCompletion = completionPercentage;
  
  return userObj;
};

export const updateProfile = async (userId, data) => {
  // Prevent updating sensitive fields via this route
  delete data.password;
  delete data.email;
  delete data.role;
  delete data.isActive;
  delete data.isEmailVerified;

  // Check username uniqueness if changing
  if (data.username) {
    const existing = await User.findOne({ username: data.username, _id: { $ne: userId } });
    if (existing) throw new ApiError(409, 'This username is already taken');
  }

  const updatedUser = await User.findByIdAndUpdate(userId, data, { new: true, runValidators: true });
  
  const userObj = updatedUser.toJSON();
  userObj.profileCompletion = calculateProfileCompletion(updatedUser);
  
  return userObj;
};

export const completeOnboarding = async (userId, data) => {
  data.hasCompletedOnboarding = true;
  return updateProfile(userId, data);
};

export const getOnboardingStatus = async (userId) => {
  const user = await User.findById(userId).select('hasCompletedOnboarding');
  return { hasCompletedOnboarding: user.hasCompletedOnboarding };
};

export const searchUsers = async (userId, q = '') => {
  const regex = q ? new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') : null;
  const filter = {
    _id: { $ne: userId },
    isActive: { $ne: false },
    ...(regex && { $or: [{ name: regex }, { username: regex }, { email: regex }] })
  };
  return User.find(filter)
    .select('name username email profilePicture')
    .limit(30)
    .lean();
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select('name username profilePicture').lean();
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

export const updateProfilePicture = async (userId, file) => {
  if (!file) throw new ApiError(400, 'No image provided');

  const user = await User.findById(userId);
  
  // Optional: delete old image from Cloudinary if it exists
  if (user.profilePicture && user.profilePicture.includes('res.cloudinary.com')) {
    try {
      // Extract public_id from Cloudinary URL
      const urlParts = user.profilePicture.split('/');
      const filename = urlParts[urlParts.length - 1];
      const publicId = filename.split('.')[0];
      const folderPath = `ai-fitness-coach/${publicId}`;
      
      // Delete in background
      cloudinary.uploader.destroy(folderPath).catch(console.error);
    } catch (e) {
      console.error('Failed to extract/delete old Cloudinary image:', e);
    }
  }

  user.profilePicture = file.path; // Cloudinary URL injected by multer-storage-cloudinary
  await user.save({ validateBeforeSave: false });
  
  const userObj = user.toJSON();
  userObj.profileCompletion = calculateProfileCompletion(user);
  
  return userObj;
};
