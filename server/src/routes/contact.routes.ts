import express from 'express';
import ContactController from '../controllers/contact.controller';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';

const router = express.Router();

// Validation rules
const contactValidation = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('subject').notEmpty().trim().withMessage('Subject is required'),
  body('message').notEmpty().trim().withMessage('Message is required')
];

// Contact form submission
router.post('/', validate(contactValidation), ContactController.sendMessage);

export default router;