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
const addToCartValidation = [
    (0, express_validator_1.body)('productId').notEmpty().withMessage('Product ID is required'),
    (0, express_validator_1.body)('quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1')
];
// All cart routes are protected
router.use(auth_1.protect);
router.get('/', controllers_1.CartController.getUserCart);
router.post('/add', (0, validate_1.validate)(addToCartValidation), controllers_1.CartController.addToCart);
router.delete('/items/:productId', controllers_1.CartController.removeFromCart);
router.delete('/clear', controllers_1.CartController.clearCart);
exports.default = router;
