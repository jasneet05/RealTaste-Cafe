import express from 'express';
import { CartController } from '../controllers';
import { protect } from '../middleware/auth';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';

const router = express.Router();

// Validation rules
const addToCartValidation = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1')
];

// All cart routes are protected
router.use(protect);

router.get('/', CartController.getUserCart);
router.post('/add', validate(addToCartValidation), CartController.addToCart);
router.delete('/items/:productId', CartController.removeFromCart);
router.delete('/clear', CartController.clearCart);

export default router;
