"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const adminSettingsSchema = new mongoose_1.Schema({
    storeName: {
        type: String,
        required: [true, 'Store name is required'],
        trim: true
    },
    storeEmail: {
        type: String,
        required: [true, 'Store email is required'],
        match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Please enter a valid email']
    },
    storePhone: {
        type: String,
        required: [true, 'Store phone is required']
    },
    storeAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    businessHours: [{
            day: {
                type: String,
                enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                required: true
            },
            open: {
                type: String,
                required: true
            },
            close: {
                type: String,
                required: true
            },
            isOpen: {
                type: Boolean,
                default: true
            }
        }],
    taxRate: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
        default: 0
    },
    shippingFee: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    freeShippingThreshold: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    minimumOrderAmount: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    socialMedia: {
        facebook: String,
        twitter: String,
        instagram: String
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});
const AdminSettings = (0, mongoose_1.model)('AdminSettings', adminSettingsSchema);
exports.default = AdminSettings;
