"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bulk_controller_1 = require("../controllers/bulk.controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/products', auth_1.protect, (0, auth_1.authorize)('admin'), bulk_controller_1.uploadMiddleware, bulk_controller_1.bulkImportProducts);
router.post('/categories', auth_1.protect, (0, auth_1.authorize)('admin'), bulk_controller_1.uploadMiddleware, bulk_controller_1.bulkImportCategories);
exports.default = router;
