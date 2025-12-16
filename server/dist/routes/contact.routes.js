"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contact_controller_1 = __importDefault(require("../controllers/contact.controller"));
const express_validator_1 = require("express-validator");
const validate_1 = require("../middleware/validate");
const router = express_1.default.Router();
// Validation rules
const contactValidation = [
    (0, express_validator_1.body)('name').notEmpty().trim().withMessage('Name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Please include a valid email'),
    (0, express_validator_1.body)('subject').notEmpty().trim().withMessage('Subject is required'),
    (0, express_validator_1.body)('message').notEmpty().trim().withMessage('Message is required')
];
// Contact form submission
router.post('/', (0, validate_1.validate)(contactValidation), contact_controller_1.default.sendMessage);
exports.default = router;
