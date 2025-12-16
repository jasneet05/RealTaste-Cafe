import { Request, Response, NextFunction } from 'express';
import { User } from '../models';
import BaseController from './base.controller';
import jwt, { SignOptions } from 'jsonwebtoken';
import ms from 'ms';

class UserController extends BaseController {
  constructor() {
    super(User);
  }

  // Register user
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      // Check if user exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered',
        });
      }

      // Create user
      const user = await User.create({ name, email, password });

      // Generate JWT Token (cast ObjectId to string)
      const token = this.generateToken(user._id.toString());

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // Login user
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // Check password (comparePassword defined in model)
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // Generate Token
      const token = this.generateToken(user._id.toString());

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // Get current user profile
  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.user?.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  // Update user profile
  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, address, phone } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user?.id,
        { name, email, address, phone },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  // Update password
  updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user?.id).select('+password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Check current password
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect',
        });
      }

      user.password = newPassword;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Password updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // Get all users (admin only)
  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      
      res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      next(error);
    }
  };

  // Update user by admin
  updateUserByAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role, isActive } = req.body;
      const userId = req.params.id;
      
      const user = await User.findByIdAndUpdate(
        userId,
        { role, isActive },
        { new: true, runValidators: true }
      ).select('-password');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: user,
        message: 'User updated successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  // Generate JWT Token
  private generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not defined');
    }

    const options: SignOptions = {
      expiresIn: (process.env.JWT_EXPIRE || '30d') as ms.StringValue,
    };

    return jwt.sign({ id: userId }, secret, options);
  }
}

export default new UserController();
