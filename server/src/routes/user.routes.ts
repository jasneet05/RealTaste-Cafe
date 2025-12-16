import express from 'express';
import { UserController } from '../controllers';
import { protect, authorize } from '../middleware/auth';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required')
];

// Public routes
router.post('/register', validate(registerValidation), UserController.register);
router.post('/login', validate(loginValidation), UserController.login);

// Protected routes
router.get('/me', protect, UserController.getProfile);
router.put('/profile', protect, UserController.updateProfile);
router.put('/password', protect, UserController.updatePassword);

// Admin routes
router.get('/', protect, authorize('admin'), UserController.getAllUsers);
router.get('/:id', protect, authorize('admin'), UserController.getOne);
router.put('/:id', protect, authorize('admin'), UserController.updateUserByAdmin);
router.delete('/:id', protect, authorize('admin'), UserController.delete);

export default router;
