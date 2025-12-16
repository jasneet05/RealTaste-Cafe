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
const categoryValidation = [
    (0, express_validator_1.body)('name').notEmpty().trim().withMessage('Category name is required')
];
// Public routes
router.get('/', controllers_1.CategoryController.getAll);
router.get('/tree', controllers_1.CategoryController.getCategoryTree);
router.get('/:id', controllers_1.CategoryController.getOne);
router.get('/:categoryId/subcategories', controllers_1.CategoryController.getSubcategories);
// Admin routes
router.use(auth_1.protect, (0, auth_1.authorize)('admin'));
router.post('/', (0, validate_1.validate)(categoryValidation), controllers_1.CategoryController.create);
router.put('/:id', (0, validate_1.validate)(categoryValidation), controllers_1.CategoryController.update);
router.delete('/:id', controllers_1.CategoryController.delete);
exports.default = router;
