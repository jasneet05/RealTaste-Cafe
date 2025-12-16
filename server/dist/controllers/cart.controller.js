"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const base_controller_1 = __importDefault(require("./base.controller"));
class CartController extends base_controller_1.default {
    constructor() {
        super(models_1.Cart);
        // Get user cart
        this.getUserCart = async (req, res, next) => {
            try {
                let cart = await models_1.Cart.findOne({ user: req.user?.id }).populate('items.product');
                if (!cart) {
                    cart = await models_1.Cart.create({
                        user: req.user?.id,
                        items: [],
                        totalAmount: 0,
                        totalItems: 0
                    });
                }
                res.status(200).json({
                    success: true,
                    data: cart
                });
            }
            catch (error) {
                next(error);
            }
        };
        // Add item to cart
        this.addToCart = async (req, res, next) => {
            try {
                const { productId, quantity } = req.body;
                // Verify product exists
                const product = await models_1.Product.findById(productId);
                if (!product) {
                    return res.status(404).json({
                        success: false,
                        message: 'Product not found'
                    });
                }
                // Check stock
                if (product.stock < quantity) {
                    return res.status(400).json({
                        success: false,
                        message: 'Insufficient stock'
                    });
                }
                let cart = await models_1.Cart.findOne({ user: req.user?.id });
                if (!cart) {
                    cart = await models_1.Cart.create({
                        user: req.user?.id,
                        items: [{
                                product: productId,
                                quantity,
                                price: product.price,
                                name: product.name
                            }],
                        totalAmount: product.price * quantity,
                        totalItems: quantity
                    });
                }
                else {
                    // Check if product exists in cart
                    const existingItem = cart.items.find(item => item.product.toString() === productId);
                    if (existingItem) {
                        existingItem.quantity = quantity;
                    }
                    else {
                        cart.items.push({
                            product: productId,
                            quantity,
                            price: product.price,
                            name: product.name
                        });
                    }
                    await cart.save();
                }
                res.status(200).json({
                    success: true,
                    data: cart
                });
            }
            catch (error) {
                next(error);
            }
        };
        // Remove item from cart
        this.removeFromCart = async (req, res, next) => {
            try {
                const { productId } = req.params;
                const cart = await models_1.Cart.findOne({ user: req.user?.id });
                if (!cart) {
                    return res.status(404).json({
                        success: false,
                        message: 'Cart not found'
                    });
                }
                cart.items = cart.items.filter(item => item.product.toString() !== productId);
                await cart.save();
                res.status(200).json({
                    success: true,
                    data: cart
                });
            }
            catch (error) {
                next(error);
            }
        };
        // Clear cart
        this.clearCart = async (req, res, next) => {
            try {
                const cart = await models_1.Cart.findOne({ user: req.user?.id });
                if (!cart) {
                    return res.status(404).json({
                        success: false,
                        message: 'Cart not found'
                    });
                }
                cart.items = [];
                cart.totalAmount = 0;
                cart.totalItems = 0;
                await cart.save();
                res.status(200).json({
                    success: true,
                    data: cart
                });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = new CartController();
