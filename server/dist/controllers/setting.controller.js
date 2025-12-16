"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.updateSetting = exports.getSettings = void 0;
const Setting_1 = __importDefault(require("../models/Setting"));
const getSettings = async (req, res) => {
    try {
        const settings = await Setting_1.default.find();
        const settingsObj = settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {});
        res.json({
            success: true,
            data: settingsObj
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch settings'
        });
    }
};
exports.getSettings = getSettings;
const updateSetting = async (req, res) => {
    try {
        const { key, value, type } = req.body;
        const setting = await Setting_1.default.findOneAndUpdate({ key }, { value, type }, { upsert: true, new: true });
        res.json({
            success: true,
            data: setting
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update setting'
        });
    }
};
exports.updateSetting = updateSetting;
const updateSettings = async (req, res) => {
    try {
        const settings = req.body;
        const updates = [];
        for (const [key, value] of Object.entries(settings)) {
            const type = typeof value === 'boolean' ? 'boolean' :
                typeof value === 'number' ? 'number' : 'string';
            updates.push(Setting_1.default.findOneAndUpdate({ key }, { value, type }, { upsert: true, new: true }));
        }
        await Promise.all(updates);
        res.json({
            success: true,
            message: 'Settings updated successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update settings'
        });
    }
};
exports.updateSettings = updateSettings;
