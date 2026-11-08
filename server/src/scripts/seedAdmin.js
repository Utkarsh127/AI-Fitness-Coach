/**
 * @file src/scripts/seedAdmin.js
 * @description Creates an initial admin user from environment variables.
 * Usage: node src/scripts/seedAdmin.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/user.model.js';

// Setup env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedAdmin = async () => {
  try {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      console.error('❌ Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment variables');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to Database');

    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists with this email.');
      process.exit(0);
    }

    const admin = new User({
      name: 'System Admin',
      email: process.env.ADMIN_EMAIL,
      username: 'admin_' + Date.now().toString().slice(-4),
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
      isEmailVerified: true
    });

    await admin.save();
    console.log('✅ Initial admin user created successfully.');
    console.log(`📧 Email: ${admin.email}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

seedAdmin();
