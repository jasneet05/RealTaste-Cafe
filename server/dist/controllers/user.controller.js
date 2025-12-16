"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const base_controller_1 = __importDefault(require("./base.controller"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserController extends base_controller_1.default {
    constructor() {
        super(models_1.User);
        // Register user
        this.register = async (req, res, next) => {
            try {
                const { name, email, password } = req.body;
                // Check if user exists
                const userExists = await models_1.User.findOne({ email });
                if (userExists) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email already registered',
                    });
                }
                // Create user
                const user = await models_1.User.create({ name, email, password });
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
            }
            catch (error) {
                next(error);
            }
        };
        // Login user
        this.login = async (req, res, next) => {
            try {
                const { email, password } = req.body;
                // Check if user exists
                const user = await models_1.User.findOne({ email }).select('+password');
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
            }
            catch (error) {
                next(error);
            }
        };
        // Get current user profile
        this.getProfile = async (req, res, next) => {
            try {
                const user = await models_1.User.findById(req.user?.id);
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
            }
            catch (error) {
                next(error);
            }
        };
        // Update user profile
        this.updateProfile = async (req, res, next) => {
            try {
                const { name, email, address, phone } = req.body;
                const user = await models_1.User.findByIdAndUpdate(req.user?.id, { name, email, address, phone }, { new: true, runValidators: true });
                res.status(200).json({
                    success: true,
                    data: user,
                });
            }
            catch (error) {
                next(error);
            }
        };
        // Update password
        this.updatePassword = async (req, res, next) => {
            try {
                const { currentPassword, newPassword } = req.body;
                const user = await models_1.User.findById(req.user?.id).select('+password');
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
            }
            catch (error) {
                next(error);
            }
        };
        // Get all users (admin only)
        this.getAllUsers = async (req, res, next) => {
            try {
                const users = await models_1.User.find().select('-password').sort({ createdAt: -1 });
                res.status(200).json({
                    success: true,
                    data: users
                });
            }
            catch (error) {
                next(error);
            }
        };
        // Update user by admin
        this.updateUserByAdmin = async (req, res, next) => {
            try {
                const { role, isActive } = req.body;
                const userId = req.params.id;
                const user = await models_1.User.findByIdAndUpdate(userId, { role, isActive }, { new: true, runValidators: true }).select('-password');
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
            }
            catch (error) {
                next(error);
            }
        };
    }
    // Generate JWT Token
    generateToken(userId) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET not defined');
        }
        const options = {
            expiresIn: (process.env.JWT_EXPIRE || '30d'),
        };
        return jsonwebtoken_1.default.sign({ id: userId }, secret, options);
    }
}
exports.default = new UserController();
