import { Request, Response, NextFunction } from 'express';
import { ShopSettings } from '../models';

class SettingsController {
  // Get shop settings
  getSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let settings = await ShopSettings.findOne();
      
      if (!settings) {
        // Create default settings if none exist
        settings = await ShopSettings.create({
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
    } catch (error) {
      next(error);
    }
  };

  // Update shop settings
  updateSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let settings = await ShopSettings.findOne();
      
      if (!settings) {
        settings = await ShopSettings.create(req.body);
      } else {
        settings = await ShopSettings.findOneAndUpdate({}, req.body, {
          new: true,
          runValidators: true
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
}

export default new SettingsController();