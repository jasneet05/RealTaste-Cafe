import { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import Product from '../models/Product';
import Category from '../models/Category';

const upload = multer({ dest: 'uploads/' });

export const uploadMiddleware = upload.single('file');

export const bulkImportProducts = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const fileContent = fs.readFileSync(req.file.path, 'utf8');
    const products = JSON.parse(fileContent);
    
    if (!Array.isArray(products)) {
      return res.status(400).json({
        success: false,
        message: 'JSON file must contain an array of products'
      });
    }

    const errors: string[] = [];
    let successCount = 0;
    
    for (let i = 0; i < products.length; i++) {
      try {
        const productData = products[i];
        const product = new Product({
          name: productData.name,
          description: productData.description,
          price: parseFloat(productData.price),
          category: productData.category,
          stock: parseInt(productData.stock) || 0,
          image: productData.image || '',
          isAvailable: productData.isAvailable !== false
        });
        
        await product.save();
        successCount++;
      } catch (error: any) {
        errors.push(`Product ${i + 1}: ${error.message}`);
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: `Imported ${successCount} products successfully`,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message.includes('JSON') ? 'Invalid JSON format' : 'Failed to import products'
    });
  }
};

export const bulkImportCategories = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const fileContent = fs.readFileSync(req.file.path, 'utf8');
    const categories = JSON.parse(fileContent);
    
    if (!Array.isArray(categories)) {
      return res.status(400).json({
        success: false,
        message: 'JSON file must contain an array of categories'
      });
    }

    const errors: string[] = [];
    let successCount = 0;
    
    for (let i = 0; i < categories.length; i++) {
      try {
        const categoryData = categories[i];
        const category = new Category({
          name: categoryData.name,
          description: categoryData.description || '',
          isActive: categoryData.isActive !== false
        });
        
        await category.save();
        successCount++;
      } catch (error: any) {
        errors.push(`Category ${i + 1}: ${error.message}`);
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: `Imported ${successCount} categories successfully`,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message.includes('JSON') ? 'Invalid JSON format' : 'Failed to import categories'
    });
  }
};