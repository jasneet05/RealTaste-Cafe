"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const base_controller_1 = __importDefault(require("./base.controller"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
class OrderController extends base_controller_1.default {
    constructor() {
        super(models_1.Order);
        // Create new order
        this.create = async (req, res, next) => {
            try {
                const { items, paymentMethod, mobileNumber, specialInstructions, totalAmount } = req.body;
                // Verify products and calculate total
                let calculatedTotal = 0;
                for (const item of items) {
                    const product = await models_1.Product.findById(item.menuItem);
                    if (!product) {
                        res.status(404).json({
                            success: false,
                            message: `Product not found: ${item.menuItem}`
                        });
                        return;
                    }
                    if (product.stock < item.quantity) {
                        res.status(400).json({
                            success: false,
                            message: `Insufficient stock for ${product.name}`
                        });
                        return;
                    }
                    calculatedTotal += product.price * item.quantity;
                }
                // Create order (takeaway - no shipping address needed)
                const order = await models_1.Order.create({
                    user: req.user?.id,
                    items,
                    paymentMethod,
                    mobileNumber,
                    specialInstructions,
                    totalAmount: totalAmount || calculatedTotal
                });
                // Update product stock
                for (const item of items) {
                    const product = await models_1.Product.findById(item.menuItem);
                    if (product) {
                        product.stock -= item.quantity;
                        await product.save();
                    }
                }
                // Send order confirmation email
                try {
                    const user = await models_1.User.findById(req.user?.id);
                    if (user) {
                        await (0, sendEmail_1.default)({
                            email: user.email,
                            subject: 'Order Confirmation - Real Taste',
                            html: `
              <h2>Order Confirmation</h2>
              <p>Hi ${user.name},</p>
              <p>Thank you for your takeaway order! Your order #${String(order._id).slice(-6)} has been received.</p>
              <p><strong>Total Amount:</strong> ₹${order.totalAmount.toFixed(2)}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              <p><strong>Pickup Location:</strong> UpalHeri, Rajpura, Punjab 140401</p>
              <p>We'll call you on ${mobileNumber} when your order is ready for pickup.</p>
              <p>Best regards,<br>Real Taste Team</p>
            `,
                            message: `Order #${String(order._id).slice(-6)} confirmed. Total: ₹${order.totalAmount.toFixed(2)}`
                        });
                    }
                }
                catch (emailError) {
                    console.error('Failed to send order confirmation email:', emailError);
                }
                res.status(201).json({
                    success: true,
                    data: order
                });
            }
            catch (error) {
                next(error);
            }
        };
        // Get user orders
        this.getUserOrders = async (req, res, next) => {
            try {
                const orders = await models_1.Order.find({ user: req.user?.id })
                    .populate('items.menuItem')
                    .populate('user', 'name email')
                    .sort('-createdAt');
                res.status(200).json({
                    success: true,
                    count: orders.length,
                    data: orders
                });
            }
            catch (error) {
                next(error);
            }
        };
        // Get all orders (admin)
        this.getAll = async (req, res, next) => {
            try {
                const orders = await models_1.Order.find()
                    .populate('items.menuItem')
                    .populate('user', 'name email')
                    .sort('-createdAt');
                res.status(200).json({
                    success: true,
                    count: orders.length,
                    data: orders
                });
            }
            catch (error) {
                next(error);
            }
        };
        // Update order status
        this.updateOrderStatus = async (req, res, next) => {
            try {
                const { status } = req.body;
                const order = await models_1.Order.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true }).populate('user');
                if (!order) {
                    return res.status(404).json({
                        success: false,
                        message: 'Order not found'
                    });
                }
                // Send status update email
                try {
                    const user = order.user;
                    if (user && user.email) {
                        const statusMessages = {
                            'Preparing': 'Your order is being prepared',
                            'Ready': 'Your order is ready for pickup/delivery',
                            'Delivered': 'Your order has been delivered',
                            'Cancelled': 'Your order has been cancelled'
                        };
                        await (0, sendEmail_1.default)({
                            email: user.email,
                            subject: `Order Update - Real Taste`,
                            html: `
              <h2>Order Status Update</h2>
              <p>Hi ${user.name},</p>
              <p>Your order #${String(order._id).slice(-6)} status has been updated.</p>
              <p><strong>New Status:</strong> ${status}</p>
              <p>${statusMessages[status] || 'Status updated'}</p>
              <p>Best regards,<br>Real Taste Team</p>
            `,
                            message: `Order #${String(order._id).slice(-6)} status: ${status}`
                        });
                    }
                }
                catch (emailError) {
                    console.error('Failed to send status update email:', emailError);
                }
                res.status(200).json({
                    success: true,
                    data: order
                });
            }
            catch (error) {
                next(error);
            }
        };
        // Mark order as paid
        this.markOrderAsPaid = async (req, res, next) => {
            try {
                const order = await models_1.Order.findById(req.params.id);
                if (!order) {
                    return res.status(404).json({
                        success: false,
                        message: 'Order not found'
                    });
                }
                order.isPaid = true;
                order.paidAt = new Date();
                order.paymentResult = {
                    id: req.body.id,
                    status: req.body.status,
                    updateTime: req.body.update_time,
                    email: req.body.email_address
                };
                const updatedOrder = await order.save();
                res.status(200).json({
                    success: true,
                    data: updatedOrder
                });
            }
            catch (error) {
                next(error);
            }
        };
        // Get single order by ID
        this.getById = async (req, res, next) => {
            try {
                const order = await models_1.Order.findById(req.params.id)
                    .populate('items.menuItem')
                    .populate('user', 'name email');
                if (!order) {
                    return res.status(404).json({
                        success: false,
                        message: 'Order not found'
                    });
                }
                // Check if user owns the order or is admin
                if (order.user._id.toString() !== req.user?.id && req.user?.role !== 'admin') {
                    return res.status(403).json({
                        success: false,
                        message: 'Not authorized to access this order'
                    });
                }
                res.status(200).json({
                    success: true,
                    data: order
                });
            }
            catch (error) {
                next(error);
            }
        };
        // Get order statistics
        this.getOrderStats = async (req, res, next) => {
            try {
                const totalOrders = await models_1.Order.countDocuments();
                const totalSales = await models_1.Order.aggregate([
                    {
                        $group: {
                            _id: null,
                            total: { $sum: '$totalAmount' }
                        }
                    }
                ]);
                const dailyOrders = await models_1.Order.aggregate([
                    {
                        $group: {
                            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                            orders: { $sum: 1 },
                            sales: { $sum: '$totalAmount' }
                        }
                    },
                    { $sort: { _id: -1 } },
                    { $limit: 7 }
                ]);
                res.status(200).json({
                    success: true,
                    data: {
                        totalOrders,
                        totalSales: totalSales[0]?.total || 0,
                        dailyOrders
                    }
                });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = new OrderController();
