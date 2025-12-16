import express from 'express';
import { ProductController } from '../controllers';
import { protect, authorize } from '../middleware/auth';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';
import { addReview, getProductReviews } from '../controllers/review.controller';

const router = express.Router();

// Validation rules
const productValidation = [
  body('name').notEmpty().trim().withMessage('Product name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('image').optional().isString().withMessage('Image must be a string'),
  body('stock').optional().isNumeric().withMessage('Stock must be a number'),
  body('isAvailable').optional().isBoolean().withMessage('isAvailable must be boolean'),
  body('featured').optional().isBoolean().withMessage('featured must be boolean')
];

// Public routes
router.get('/', ProductController.getAll);
router.get('/featured', ProductController.getFeatured);
router.get('/category/:categoryId', ProductController.getByCategory);
router.get('/search', ProductController.searchProducts);
router.get('/:id', ProductController.getOne);
router.get('/:productId/reviews', getProductReviews);

// Protected routes
router.post('/:id/review', protect, ProductController.addReview);
router.post('/:productId/reviews', protect, addReview);

// Admin routes
router.post(
  '/',
  protect,
  authorize('admin'),
  validate(productValidation),
  ProductController.create
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  validate(productValidation),
  ProductController.update
);

router.delete('/:id', protect, authorize('admin'), ProductController.delete);
router.put('/:id/stock', protect, authorize('admin'), ProductController.updateStock);
router.put('/:id/availability', protect, authorize('admin'), ProductController.toggleAvailability);

export default router;
