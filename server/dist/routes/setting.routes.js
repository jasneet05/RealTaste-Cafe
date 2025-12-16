"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const setting_controller_1 = require("../controllers/setting.controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', setting_controller_1.getSettings);
router.put('/', auth_1.protect, (0, auth_1.authorize)('admin'), setting_controller_1.updateSettings);
router.put('/:key', auth_1.protect, (0, auth_1.authorize)('admin'), setting_controller_1.updateSetting);
exports.default = router;
