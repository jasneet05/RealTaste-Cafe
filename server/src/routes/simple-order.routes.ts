import express from 'express';
import SimpleOrderController from '../controllers/simple-order.controller';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Protected routes
router.use(protect);

// Admin routes (must be before /:id)
router.get('/all', authorize('admin'), SimpleOrderController.getAll);
router.put('/:id/status', authorize('admin'), SimpleOrderController.updateOrderStatus);

// User routes
router.post('/', SimpleOrderController.create);
router.get('/my-orders', SimpleOrderController.getUserOrders);
router.get('/:id', SimpleOrderController.getById);

export default router;