"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const simple_order_controller_1 = __importDefault(require("../controllers/simple-order.controller"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Protected routes
router.use(auth_1.protect);
// Admin routes (must be before /:id)
router.get('/all', (0, auth_1.authorize)('admin'), simple_order_controller_1.default.getAll);
router.put('/:id/status', (0, auth_1.authorize)('admin'), simple_order_controller_1.default.updateOrderStatus);
// User routes
router.post('/', simple_order_controller_1.default.create);
router.get('/my-orders', simple_order_controller_1.default.getUserOrders);
router.get('/:id', simple_order_controller_1.default.getById);
exports.default = router;
