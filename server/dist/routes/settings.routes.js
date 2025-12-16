"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const settings_controller_1 = __importDefault(require("../controllers/settings.controller"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// @route   GET /api/settings
// @desc    Get shop settings
// @access  Public
router.get('/', settings_controller_1.default.getSettings);
// @route   PUT /api/settings
// @desc    Update shop settings
// @access  Private/Admin
router.put('/', auth_1.protect, (0, auth_1.authorize)('admin'), settings_controller_1.default.updateSettings);
exports.default = router;
