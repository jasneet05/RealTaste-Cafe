"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const base_controller_1 = __importDefault(require("./base.controller"));
class AdminSettingsController extends base_controller_1.default {
    constructor() {
        super(models_1.AdminSettings);
        // Get store settings
        this.getSettings = async (req, res, next) => {
            try {
                let settings = await models_1.AdminSettings.findOne().sort('-createdAt');
                if (!settings) {
                    settings = await models_1.AdminSettings.create({
                        storeName: 'Real Taste',
                        storeEmail: 'contact@realtaste.com',
                        storePhone: '+1234567890',
                        updatedBy: req.user?.id
                    });
                }
                res.status(200).json({
                    success: true,
                    data: settings
                });
            }
            catch (error) {
                next(error);
            }
        };
        // Update store settings
        this.updateSettings = async (req, res, next) => {
            try {
                const settings = await models_1.AdminSettings.findOneAndUpdate({}, {
                    ...req.body,
                    updatedBy: req.user?.id
                }, {
                    new: true,
                    runValidators: true,
                    upsert: true
                });
                res.status(200).json({
                    success: true,
                    data: settings
                });
            }
            catch (error) {
                next(error);
            }
        };
        // Update business hours
        this.updateBusinessHours = async (req, res, next) => {
            try {
                const { businessHours } = req.body;
                const settings = await models_1.AdminSettings.findOne();
                if (!settings) {
                    return res.status(404).json({
                        success: false,
                        message: 'Settings not found'
                    });
                }
                settings.businessHours = businessHours;
                if (req.user?.id) {
                    settings.updatedBy = require('mongoose').Types.ObjectId(req.user.id);
                }
                await settings.save();
                res.status(200).json({
                    success: true,
                    data: settings
                });
            }
            catch (error) {
                next(error);
            }
        };
        // Update tax and shipping settings
        this.updatePricing = async (req, res, next) => {
            try {
                const { taxRate, shippingFee, freeShippingThreshold, minimumOrderAmount } = req.body;
                const settings = await models_1.AdminSettings.findOneAndUpdate({}, {
                    taxRate,
                    shippingFee,
                    freeShippingThreshold,
                    minimumOrderAmount,
                    updatedBy: req.user?.id
                }, {
                    new: true,
                    runValidators: true,
                    upsert: true
                });
                res.status(200).json({
                    success: true,
                    data: settings
                });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = new AdminSettingsController();
