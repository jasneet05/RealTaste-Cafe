import { Request, Response, NextFunction } from 'express';
import { Category } from '../models';
import BaseController from './base.controller';

class CategoryController extends BaseController {
  constructor() {
    super(Category);
  }

  // Get category tree
  getCategoryTree = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await Category.find()
        .sort('path')
        .select('name slug path level parentId');

      const categoryTree = this.buildCategoryTree(categories);

      res.status(200).json({
        success: true,
        data: categoryTree
      });
    } catch (error) {
      next(error);
    }
  };

  // Get subcategories
  getSubcategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { categoryId } = req.params;
      const subcategories = await Category.find({ parentId: categoryId })
        .sort('name')
        .select('name slug path level');

      res.status(200).json({
        success: true,
        count: subcategories.length,
        data: subcategories
      });
    } catch (error) {
      next(error);
    }
  };

  // Create category
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, parentId } = req.body;
      
      // Generate slug from name
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const category = await Category.create({
        name,
        slug,
        parentId,
        createdBy: req.user?.id,
        updatedBy: req.user?.id
      });

      res.status(201).json({
        success: true,
        data: category
      });
    } catch (error) {
      next(error);
    }
  };

  // Update category
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;
      
      // Generate new slug if name is changed
      const updateData: any = {
        name,
        updatedBy: req.user?.id
      };

      if (name) {
        updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }

      const category = await Category.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      res.status(200).json({
        success: true,
        data: category
      });
    } catch (error) {
      next(error);
    }
  };

  // Delete category (only if it has no subcategories)
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await Category.findById(req.params.id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      // Check for subcategories
      const hasSubcategories = await Category.exists({ parentId: category._id });
      if (hasSubcategories) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete category with subcategories'
        });
      }

  await category.deleteOne();

      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (error) {
      next(error);
    }
  };

  // Helper method to build category tree
  private buildCategoryTree(categories: any[]) {
    const categoryMap = new Map();
    const roots: any[] = [];

    categories.forEach(category => {
      categoryMap.set(category._id.toString(), {
        ...category.toObject(),
        children: []
      });
    });

    categoryMap.forEach(category => {
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId.toString());
        if (parent) {
          parent.children.push(category);
        }
      } else {
        roots.push(category);
      }
    });

    return roots;
  }
}

export default new CategoryController();
