"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const base_controller_1 = __importDefault(require("./base.controller"));
class ProductController extends base_controller_1.default {
    constructor() {
        super(models_1.Product);
        // Get products by category
        this.getByCategory = async (req, res, next) => {
            try {
                const { categoryId } = req.params;
                const products = await models_1.Product.find({ category: categoryId })
                    .sort('-createdAt');
                res.status(200).json({
                    success: true,
                    count: products.length,
                    data: products
                });
            }
            catch (error) {
                next(error);
            }
        };
        // Search products
        this.searchProducts = async (req, res, next) => {
            try {
                const { query } = req.query;
                const products = await models_1.Product.find({
                    $or: [
                        { name: { $regex: query, $options: 'i' } },
                        { description: { $regex: query, $options: 'i' } }
                    ]
                });
                res.status(200).json({
                    success: true,
                    count: products.length,
                    data: products
                });
            }
            catch (error) {
                next(error);
            }
        };
        // Get featured products
        this.getFeatured = async (req, res, next) => {
            try {
                const products = await models_1.Product.find({ featured: true, isAvailable: true })
                    .limit(10);
                res.status(200).json({
                    success: true,
                    count: products.length,
                    data: products
                });
            }
            catch (error) {
                next(error);
            }
        };
        // Add review to product
        this.addReview = async (req, res, next) => {
            try {
                const { rating, comment } = req.body;
                const product = await models_1.Product.findById(req.params.id);
                if (!product) {
                    return res.status(404).json({
                        success: false,
                        message: 'Product not found'
                    });
                }
                const review = {
                    rating: Number(rating),
                    comment,
                    user: req.user?.id ? require('mongoose').Types.ObjectId(req.user.id) : undefined,
                    createdAt: new Date()
                };
                product.reviews = product.reviews || [];
                product.reviews.push(review);
                if (typeof product.calculateAverageRating === 'function') {
                    await product.calculateAverageRating();
                }
                res.status(200).json({
                    success: true,
                    data: product
                });
            }
            catch (error) {
                next(error);
            }
        };
        // Update product stock
        this.updateStock = async (req, res, next) => {
            try {
                const { stock } = req.body;
                const product = await models_1.Product.findByIdAndUpdate(req.params.id, { stock }, { new: true, runValidators: true });
                if (!product) {
                    return res.status(404).json({
                        success: false,
                        message: 'Product not found'
                    });
                }
                res.status(200).json({
                    success: true,
                    data: product
                });
            }
            catch (error) {
                next(error);
            }
        };
        // Toggle product availability
        this.toggleAvailability = async (req, res, next) => {
            try {
                const product = await models_1.Product.findById(req.params.id);
                if (!product) {
                    return res.status(404).json({
                        success: false,
                        message: 'Product not found'
                    });
                }
                product.isAvailable = !product.isAvailable;
                await product.save();
                res.status(200).json({
                    success: true,
                    data: product
                });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = new ProductController();
