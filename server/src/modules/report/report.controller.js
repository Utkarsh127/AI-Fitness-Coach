/**
 * @module modules/report/report.controller
 * @description Controller for public report endpoints.
 */

import asyncHandler from '../../utils/asyncHandler.js';
import * as reportService from './report.service.js';

export const submitReport = asyncHandler(async (req, res) => {
  const io = req.app.get('io');
  const report = await reportService.createReport(req.user._id, req.body, io);
  
  res.status(201).json({
    success: true,
    data: report,
    message: 'Report submitted successfully'
  });
});
