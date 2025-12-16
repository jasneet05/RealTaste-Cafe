import { Request, Response, NextFunction } from 'express';
import { Product } from '../models';
import BaseController from './base.controller';

class ProductController extends BaseController {
  constructor() {
    super(Product);
  }

  // Get products by category
  getByCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { categoryId } = req.params;
      const products = await Product.find({ category: categoryId })
        .sort('-createdAt');

      res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      next(error);
    }
  };

  // Search products
  searchProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query } = req.query;
      const products = await Product.find({
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
    } catch (error) {
      next(error);
    }
  };

  // Get featured products
  getFeatured = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await Product.find({ featured: true, isAvailable: true })
        .limit(10);

      res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      next(error);
    }
  };

  // Add review to product
  addReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { rating, comment } = req.body;
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      const review = {
        rating: Number(rating),
        comment,
        user: new (require('mongoose')).Types.ObjectId(req.user?.id),
        createdAt: new Date()
      };

      product.reviews = product.reviews || [];
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
      await product.save();

      res.status(200).json({
        success: true,
        message: 'Review added successfully',
        data: product
      });
    } catch (error) {
      next(error);
    }
  };

  // Update product stock
  updateStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { stock } = req.body;
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { stock },
        { new: true, runValidators: true }
      );

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
    } catch (error) {
      next(error);
    }
  };

  // Toggle product availability
  toggleAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await Product.findById(req.params.id);

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
    } catch (error) {
      next(error);
    }
  };
}

export default new ProductController();
