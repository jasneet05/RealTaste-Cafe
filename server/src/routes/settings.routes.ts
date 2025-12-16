import express from 'express';
import settingsController from '../controllers/settings.controller';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/settings
// @desc    Get shop settings
// @access  Public
router.get('/', settingsController.getSettings);

// @route   PUT /api/settings
// @desc    Update shop settings
// @access  Private/Admin
router.put('/', protect, authorize('admin'), settingsController.updateSettings);

export default router;