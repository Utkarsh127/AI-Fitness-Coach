/**
 * @module modules/admin/admin.routes
 * @description Express router for admin-only routes.
 */

import { Router } from 'express';
import { protect, authorize } from '../../middlewares/auth.middleware.js';
import * as adminController from './admin.controller.js';

const router = Router();

// Apply protection and admin authorization to all routes in this file
router.use(protect, authorize('admin'));

router.route('/users')
  .get(adminController.getUsers)
  .post(adminController.createUser);

router.route('/users/:id')
  .get(adminController.getUser)
  .patch(adminController.updateUser)
  .delete(adminController.deactivateUser);

// ─── Stats ───────────────────────────────────────────────────────────────────
router.get('/stats', adminController.getStats);

// ─── Reports ─────────────────────────────────────────────────────────────────
router.route('/reports')
  .get(adminController.getReports);

router.route('/reports/:id/status')
  .patch(adminController.updateReportStatus);

// ─── Audit Logs ──────────────────────────────────────────────────────────────
router.get('/logs', adminController.getAuditLogs);

// ─── Community Moderation ────────────────────────────────────────────────────
router.route('/posts')
  .get(adminController.getCommunityPosts);

router.route('/posts/:id')
  .delete(adminController.deleteCommunityPost);

// ─── Messages Moderation ─────────────────────────────────────────────────────
router.route('/messages')
  .get(adminController.getMessages);

router.route('/messages/:id')
  .delete(adminController.deleteMessage);

export default router;
