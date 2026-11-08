/**
 * @file src/app.js
 * @description Express application factory.
 *
 * Mounts global middleware (Helmet, CORS, Morgan, JSON parsing,
 * rate-limiters, cookie-parser) and registers all versioned API route groups.
 * Exported as a factory so tests can create isolated instances.
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { globalLimiter } from './middlewares/rateLimiter.middleware.js';
import errorHandler from './middlewares/error.middleware.js';

import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/user/user.routes.js';
import exerciseRoutes from './modules/exercise/exercise.routes.js';
import workoutRoutes from './modules/workout/workout.routes.js';
import communityRoutes from './modules/community/community.routes.js';
import messagingRoutes from './modules/messaging/messaging.routes.js';
import notificationRoutes from './modules/notifications/notification.routes.js';
import learningRoutes from './modules/learning/learning.routes.js';
import aiRoutes from './modules/ai/ai.routes.js';
import videoRoutes from './modules/videos/video.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import reportRoutes from './modules/report/report.routes.js';
import shortsRoutes from './modules/shorts/shorts.routes.js';

const createApp = () => {
  const app = express();

  // ─── Security headers ───────────────────────────────────────────────────────
  app.use(helmet());

  // ─── CORS ───────────────────────────────────────────────────────────────────
  app.use(
    cors({
      origin: [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5174'].filter(Boolean),
      credentials: true, // Required for httpOnly cookie exchange
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // ─── Body parsing & cookies ─────────────────────────────────────────────────
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(cookieParser());

  // ─── HTTP request logging ────────────────────────────────────────────────────
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // ─── Global rate limiter ────────────────────────────────────────────────────
  app.use('/api', globalLimiter);

  // ─── Health check ────────────────────────────────────────────────────────────
  app.get('/api/health', (_req, res) => {
    res.status(200).json({ success: true, message: 'Server is healthy', env: process.env.NODE_ENV });
  });

  // ─── API v1 routes ───────────────────────────────────────────────────────────
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/exercises', exerciseRoutes);
  app.use('/api/v1/workouts', workoutRoutes);
  app.use('/api/v1/community', communityRoutes);
  app.use('/api/v1/messages', messagingRoutes);
  app.use('/api/v1/notifications', notificationRoutes);
  app.use('/api/v1/learning', learningRoutes);
  app.use('/api/v1/ai', aiRoutes);
  app.use('/api/v1/videos', videoRoutes);
  app.use('/api/v1/admin', adminRoutes);
  app.use('/api/v1/reports', reportRoutes);
  app.use('/api/v1/shorts', shortsRoutes);
  // Future: app.use('/api/v1/nutrition', nutritionRoutes);
  // Future: app.use('/api/v1/posts',     postRoutes);

  // ─── 404 handler for unknown API paths ──────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });

  // ─── Global error handler (must be last) ────────────────────────────────────
  app.use(errorHandler);

  return app;
};

export default createApp;
