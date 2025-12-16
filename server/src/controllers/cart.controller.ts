import { Request, Response, NextFunction } from 'express';
import { Cart, Product } from '../models';
import BaseController from './base.controller';

class CartController extends BaseController {
  constructor() {
    super(Cart);
  }

  // Get user cart
  getUserCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let cart = await Cart.findOne({ user: req.user?.id }).populate('items.product');

      if (!cart) {
        cart = await Cart.create({
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
    } catch (error) {
      next(error);
    }
  };

  // Add item to cart
  addToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId, quantity } = req.body;

      // Verify product exists
      const product = await Product.findById(productId);
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

      let cart = await Cart.findOne({ user: req.user?.id });

      if (!cart) {
        cart = await Cart.create({
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
      } else {
        // Check if product exists in cart
        const existingItem = cart.items.find(
          item => item.product.toString() === productId
        );

        if (existingItem) {
          existingItem.quantity = quantity;
        } else {
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
    } catch (error) {
      next(error);
    }
  };

  // Remove item from cart
  removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const cart = await Cart.findOne({ user: req.user?.id });

      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found'
        });
      }

      cart.items = cart.items.filter(
        item => item.product.toString() !== productId
      );

      await cart.save();

      res.status(200).json({
        success: true,
        data: cart
      });
    } catch (error) {
      next(error);
    }
  };

  // Clear cart
  clearCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cart = await Cart.findOne({ user: req.user?.id });

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
    } catch (error) {
      next(error);
    }
  };
}

export default new CartController();
