import { Request, Response, NextFunction } from 'express';
import { Model, Document } from 'mongoose';

export default abstract class BaseController {
  constructor(protected model: Model<any>) {}

  // Get all items with pagination
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sort = (req.query.sort as string) || '-createdAt';
      const skip = (page - 1) * limit;

      const items = await this.model
        .find()
        .sort(sort)
        .skip(skip)
        .limit(limit);

      const total = await this.model.countDocuments();

      res.status(200).json({
        success: true,
        data: items,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // Get single item by ID
  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.model.findById(req.params.id);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Item not found'
        });
      }

      res.status(200).json({
        success: true,
        data: item
      });
    } catch (error) {
      next(error);
    }
  };

  // Create new item
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const item = await this.model.create(req.body);
      res.status(201).json({
        success: true,
        data: item
      });
    } catch (error) {
      next(error);
    }
  };

  // Update item
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.model.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Item not found'
        });
      }

      res.status(200).json({
        success: true,
        data: item
      });
    } catch (error) {
      next(error);
    }
  };

  // Delete item
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.model.findByIdAndDelete(req.params.id);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Item not found'
        });
      }

      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (error) {
      next(error);
    }
  };
}
