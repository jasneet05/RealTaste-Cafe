"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkImportCategories = exports.bulkImportProducts = exports.uploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const Product_1 = __importDefault(require("../models/Product"));
const Category_1 = __importDefault(require("../models/Category"));
const upload = (0, multer_1.default)({ dest: 'uploads/' });
exports.uploadMiddleware = upload.single('file');
const bulkImportProducts = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }
        const results = [];
        const errors = [];
        fs_1.default.createReadStream(req.file.path)
            .pipe((0, csv_parser_1.default)())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
            let successCount = 0;
            for (const row of results) {
                try {
                    const product = new Product_1.default({
                        name: row.name,
                        description: row.description,
                        price: parseFloat(row.price),
                        category: row.category,
                        stock: parseInt(row.stock) || 0,
                        image: row.image || '',
                        isAvailable: row.isAvailable !== 'false'
                    });
                    await product.save();
                    successCount++;
                }
                catch (error) {
                    errors.push(`Row ${results.indexOf(row) + 1}: ${error.message}`);
                }
            }
            // Clean up uploaded file
            fs_1.default.unlinkSync(req.file.path);
            res.json({
                success: true,
                message: `Imported ${successCount} products successfully`,
                errors: errors.length > 0 ? errors : undefined
            });
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to import products'
        });
    }
};
exports.bulkImportProducts = bulkImportProducts;
const bulkImportCategories = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }
        const results = [];
        const errors = [];
        fs_1.default.createReadStream(req.file.path)
            .pipe((0, csv_parser_1.default)())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
            let successCount = 0;
            for (const row of results) {
                try {
                    const category = new Category_1.default({
                        name: row.name,
                        description: row.description || '',
                        isActive: row.isActive !== 'false'
                    });
                    await category.save();
                    successCount++;
                }
                catch (error) {
                    errors.push(`Row ${results.indexOf(row) + 1}: ${error.message}`);
                }
            }
            // Clean up uploaded file
            fs_1.default.unlinkSync(req.file.path);
            res.json({
                success: true,
                message: `Imported ${successCount} categories successfully`,
                errors: errors.length > 0 ? errors : undefined
            });
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to import categories'
        });
    }
};
exports.bulkImportCategories = bulkImportCategories;
