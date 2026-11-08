/**
 * @module config/cloudinary
 * @description Cloudinary SDK configuration.
 *
 * Initialises the v2 Cloudinary SDK with credentials from environment
 * variables and exports the configured instance.
 */

import { v2 as cloudinary } from 'cloudinary';

// Configure only if env vars are present to prevent crashes on startup without them
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export default cloudinary;
