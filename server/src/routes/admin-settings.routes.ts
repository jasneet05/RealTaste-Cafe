import express from 'express';
import { AdminSettingsController } from '../controllers';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// All routes are protected and admin-only
router.use(protect, authorize('admin'));

router.get('/', AdminSettingsController.getSettings);
router.put('/', AdminSettingsController.updateSettings);
router.put('/business-hours', AdminSettingsController.updateBusinessHours);
router.put('/pricing', AdminSettingsController.updatePricing);

export default router;
