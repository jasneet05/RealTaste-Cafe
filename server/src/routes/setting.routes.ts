import express from 'express';
import { getSettings, updateSetting, updateSettings } from '../controllers/setting.controller';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', getSettings);
router.put('/', protect, authorize('admin'), updateSettings);
router.put('/:key', protect, authorize('admin'), updateSetting);

export default router;