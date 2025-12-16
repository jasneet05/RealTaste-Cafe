"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes are protected and admin-only
router.use(auth_1.protect, (0, auth_1.authorize)('admin'));
router.get('/', controllers_1.AdminSettingsController.getSettings);
router.put('/', controllers_1.AdminSettingsController.updateSettings);
router.put('/business-hours', controllers_1.AdminSettingsController.updateBusinessHours);
router.put('/pricing', controllers_1.AdminSettingsController.updatePricing);
exports.default = router;
