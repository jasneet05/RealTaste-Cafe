"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
class SettingsController {
    constructor() {
        // Get shop settings
        this.getSettings = async (req, res, next) => {
            try {
                let settings = await models_1.ShopSettings.findOne();
                if (!settings) {
                    // Create default settings if none exist
                    settings = await models_1.ShopSettings.create({
                        shopName: 'Real Taste Takeaway',
                        phone: '+91 9465520816',
                        email: 'hello@realtastecafe.com',
                        address: 'UpalHeri, Rajpura, Punjab 140401',
                        openTime: '10:00',
                        closeTime: '21:00',
                        preparationTime: 15,
                        isOpen: true,
                        maintenanceMode: false,
                        otpVerification: true
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
        // Update shop settings
        this.updateSettings = async (req, res, next) => {
            try {
                let settings = await models_1.ShopSettings.findOne();
                if (!settings) {
                    settings = await models_1.ShopSettings.create(req.body);
                }
                else {
                    settings = await models_1.ShopSettings.findOneAndUpdate({}, req.body, {
                        new: true,
                        runValidators: true
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
    }
}
exports.default = new SettingsController();
