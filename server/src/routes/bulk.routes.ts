import express from 'express';
import { bulkImportProducts, bulkImportCategories, uploadMiddleware } from '../controllers/bulk.controller';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/products', protect, authorize('admin'), uploadMiddleware, bulkImportProducts);
router.post('/categories', protect, authorize('admin'), uploadMiddleware, bulkImportCategories);

export default router;