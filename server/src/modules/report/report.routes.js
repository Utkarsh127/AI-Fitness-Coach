/**
 * @module modules/report/report.routes
 * @description Express router for user reporting endpoints.
 */

import { Router } from 'express';
import { protect } from '../../middlewares/auth.middleware.js';
import * as reportController from './report.controller.js';

const router = Router();

router.post('/', protect, reportController.submitReport);

export default router;
