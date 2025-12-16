"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
class SimpleOrderController {
    constructor() {
        // Create new order - simplified
        this.create = async (req, res) => {
            try {
                const { items, totalAmount } = req.body;
                if (!items || !Array.isArray(items) || items.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Items are required'
                    });
                }
                if (!totalAmount || totalAmount <= 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Total amount is required'
                    });
                }
                // Create order without complex validation
                const orderData = {
                    user: req.user?.id,
                    items: items.map(item => ({
                        menuItem: item.menuItem,
                        quantity: item.quantity || 1,
                        price: item.price || 0
                    })),
                    totalAmount: Number(totalAmount),
                    status: 'Pending',
                    paymentMethod: 'Cash',
                    paymentStatus: 'Pending'
                };
                const order = await models_1.Order.create(orderData);
                res.status(201).json({
                    success: true,
                    data: order,
                    message: 'Order created successfully'
                });
            }
            catch (error) {
                console.error('Order creation error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to create order'
                });
            }
        };
        // Get user orders
        this.getUserOrders = async (req, res) => {
            try {
                const orders = await models_1.Order.find({ user: req.user?.id })
                    .populate('items.menuItem', 'name price image images')
                    .sort({ createdAt: -1 });
                res.status(200).json({
                    success: true,
                    data: orders
                });
            }
            catch (error) {
                console.error('Get user orders error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to fetch orders'
                });
            }
        };
        // Get all orders (admin)
        this.getAll = async (req, res) => {
            try {
                const orders = await models_1.Order.find()
                    .populate('user', 'name email')
                    .populate('items.menuItem', 'name price image images')
                    .sort({ createdAt: -1 });
                res.status(200).json({
                    success: true,
                    data: orders
                });
            }
            catch (error) {
                console.error('Get all orders error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to fetch orders'
                });
            }
        };
        // Get single order
        this.getById = async (req, res) => {
            try {
                const order = await models_1.Order.findById(req.params.id)
                    .populate('user', 'name email')
                    .populate('items.menuItem', 'name price image images');
                if (!order) {
                    return res.status(404).json({
                        success: false,
                        message: 'Order not found'
                    });
                }
                res.status(200).json({
                    success: true,
                    data: order
                });
            }
            catch (error) {
                console.error('Get order error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to fetch order'
                });
            }
        };
        // Update order status
        this.updateOrderStatus = async (req, res) => {
            try {
                const { status } = req.body;
                const order = await models_1.Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
                if (!order) {
                    return res.status(404).json({
                        success: false,
                        message: 'Order not found'
                    });
                }
                res.status(200).json({
                    success: true,
                    data: order
                });
            }
            catch (error) {
                console.error('Update order status error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to update order status'
                });
            }
        };
    }
}
exports.default = new SimpleOrderController();
