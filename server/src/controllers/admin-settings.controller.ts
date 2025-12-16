import { Request, Response, NextFunction } from 'express';
import { AdminSettings } from '../models';
import BaseController from './base.controller';

class AdminSettingsController extends BaseController {
  constructor() {
    super(AdminSettings);
  }

  // Get store settings
  getSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let settings = await AdminSettings.findOne().sort('-createdAt');

      if (!settings) {
        settings = await AdminSettings.create({
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
    } catch (error) {
      next(error);
    }
  };

  // Update store settings
  updateSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await AdminSettings.findOneAndUpdate(
        {},
        {
          ...req.body,
          updatedBy: req.user?.id
        },
        {
          new: true,
          runValidators: true,
          upsert: true
        }
      );

      res.status(200).json({
        success: true,
        data: settings
      });
    } catch (error) {
      next(error);
    }
  };

  // Update business hours
  updateBusinessHours = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { businessHours } = req.body;
      const settings = await AdminSettings.findOne();

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
    } catch (error) {
      next(error);
    }
  };

  // Update tax and shipping settings
  updatePricing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        taxRate,
        shippingFee,
        freeShippingThreshold,
        minimumOrderAmount
      } = req.body;

      const settings = await AdminSettings.findOneAndUpdate(
        {},
        {
          taxRate,
          shippingFee,
          freeShippingThreshold,
          minimumOrderAmount,
          updatedBy: req.user?.id
        },
        {
          new: true,
          runValidators: true,
          upsert: true
        }
      );

      res.status(200).json({
        success: true,
        data: settings
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new AdminSettingsController();
