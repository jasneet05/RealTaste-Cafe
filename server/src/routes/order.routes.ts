import express from 'express';
import { OrderController } from '../controllers';
import { protect, authorize } from '../middleware/auth';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';

const router = express.Router();

// Validation rules
const orderValidation = [
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.menuItem').notEmpty().withMessage('Menu item ID is required'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('totalAmount').isNumeric().withMessage('Total amount is required')
];

// Protected routes
router.use(protect);

router.post('/', validate(orderValidation), OrderController.create);
router.get('/my-orders', OrderController.getUserOrders);
router.get('/:id', OrderController.getById);

// Admin routes (must be before /:id route)
router.get('/all', protect, authorize('admin'), OrderController.getAll);
router.get('/stats', protect, authorize('admin'), OrderController.getOrderStats);
router.put('/:id/status', protect, authorize('admin'), OrderController.updateOrderStatus);
router.put('/:id/pay', protect, authorize('admin'), OrderController.markOrderAsPaid);

export default router;
