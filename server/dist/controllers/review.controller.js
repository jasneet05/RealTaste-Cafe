"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductReviews = exports.addReview = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const addReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id;
        const product = await Product_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Check if user already reviewed this product
        const existingReviewIndex = product.reviews?.findIndex((review) => review.user.toString() === userId);
        if (existingReviewIndex !== -1) {
            // Update existing review
            product.reviews[existingReviewIndex] = {
                ...product.reviews[existingReviewIndex],
                rating: Number(rating),
                comment,
                createdAt: product.reviews[existingReviewIndex].createdAt, // Keep original date
                updatedAt: new Date()
            };
        }
        else {
            // Add new review
            const review = {
                user: userId,
                rating: Number(rating),
                comment,
                createdAt: new Date()
            };
            product.reviews = product.reviews || [];
            product.reviews.push(review);
        }
        await product.save();
        // Populate user data for response
        await product.populate('reviews.user', 'name');
        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            data: product.reviews
        });
    }
    catch (error) {
        console.error('Add review error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.addReview = addReview;
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product_1.default.findById(productId).populate('reviews.user', 'name');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({
            success: true,
            data: product.reviews || []
        });
    }
    catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getProductReviews = getProductReviews;
