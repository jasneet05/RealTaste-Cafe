import express from 'express';
import { CategoryController } from '../controllers';
import { protect, authorize } from '../middleware/auth';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';

const router = express.Router();

// Validation rules
const categoryValidation = [
  body('name').notEmpty().trim().withMessage('Category name is required')
];

// Public routes
router.get('/', CategoryController.getAll);
router.get('/tree', CategoryController.getCategoryTree);
router.get('/:id', CategoryController.getOne);
router.get('/:categoryId/subcategories', CategoryController.getSubcategories);

// Admin routes
router.use(protect, authorize('admin'));

router.post('/', validate(categoryValidation), CategoryController.create);
router.put('/:id', validate(categoryValidation), CategoryController.update);
router.delete('/:id', CategoryController.delete);

export default router;
