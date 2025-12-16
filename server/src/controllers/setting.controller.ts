import { Request, Response } from 'express';
import Setting from '../models/Setting';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await Setting.find();
    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as any);

    res.json({
      success: true,
      data: settingsObj
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
};

export const updateSetting = async (req: Request, res: Response) => {
  try {
    const { key, value, type } = req.body;

    const setting = await Setting.findOneAndUpdate(
      { key },
      { value, type },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      data: setting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update setting'
    });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const settings = req.body;
    const updates = [];

    for (const [key, value] of Object.entries(settings)) {
      const type = typeof value === 'boolean' ? 'boolean' : 
                   typeof value === 'number' ? 'number' : 'string';
      
      updates.push(
        Setting.findOneAndUpdate(
          { key },
          { value, type },
          { upsert: true, new: true }
        )
      );
    }

    await Promise.all(updates);

    res.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
};