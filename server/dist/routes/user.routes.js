"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const validate_1 = require("../middleware/validate");
const router = express_1.default.Router();
// Validation rules
const registerValidation = [
    (0, express_validator_1.body)('name').notEmpty().trim().withMessage('Name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Please include a valid email'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];
const loginValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please include a valid email'),
    (0, express_validator_1.body)('password').exists().withMessage('Password is required')
];
// Public routes
router.post('/register', (0, validate_1.validate)(registerValidation), controllers_1.UserController.register);
router.post('/login', (0, validate_1.validate)(loginValidation), controllers_1.UserController.login);
// Protected routes
router.get('/me', auth_1.protect, controllers_1.UserController.getProfile);
router.put('/profile', auth_1.protect, controllers_1.UserController.updateProfile);
router.put('/password', auth_1.protect, controllers_1.UserController.updatePassword);
// Admin routes
router.get('/', auth_1.protect, (0, auth_1.authorize)('admin'), controllers_1.UserController.getAllUsers);
router.get('/:id', auth_1.protect, (0, auth_1.authorize)('admin'), controllers_1.UserController.getOne);
router.put('/:id', auth_1.protect, (0, auth_1.authorize)('admin'), controllers_1.UserController.updateUserByAdmin);
router.delete('/:id', auth_1.protect, (0, auth_1.authorize)('admin'), controllers_1.UserController.delete);
exports.default = router;
