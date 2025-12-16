"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const base_controller_1 = __importDefault(require("./base.controller"));
class CategoryController extends base_controller_1.default {
    constructor() {
        super(models_1.Category);
        // Get category tree
        this.getCategoryTree = async (req, res, next) => {
            try {
                const categories = await models_1.Category.find()
                    .sort('path')
                    .select('name slug path level parentId');
                const categoryTree = this.buildCategoryTree(categories);
                res.status(200).json({
                    success: true,
                    data: categoryTree
                });
            }
            catch (error) {
                next(error);
            }
        };
        // Get subcategories
        this.getSubcategories = async (req, res, next) => {
            try {
                const { categoryId } = req.params;
                const subcategories = await models_1.Category.find({ parentId: categoryId })
                    .sort('name')
                    .select('name slug path level');
                res.status(200).json({
                    success: true,
                    count: subcategories.length,
                    data: subcategories
                });
            }
            catch (error) {
                next(error);
            }
        };
        // Create category
        this.create = async (req, res, next) => {
            try {
                const { name, parentId } = req.body;
                // Generate slug from name
                const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const category = await models_1.Category.create({
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
            }
            catch (error) {
                next(error);
            }
        };
        // Update category
        this.update = async (req, res, next) => {
            try {
                const { name } = req.body;
                // Generate new slug if name is changed
                const updateData = {
                    name,
                    updatedBy: req.user?.id
                };
                if (name) {
                    updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                }
                const category = await models_1.Category.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
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
            }
            catch (error) {
                next(error);
            }
        };
        // Delete category (only if it has no subcategories)
        this.delete = async (req, res, next) => {
            try {
                const category = await models_1.Category.findById(req.params.id);
                if (!category) {
                    return res.status(404).json({
                        success: false,
                        message: 'Category not found'
                    });
                }
                // Check for subcategories
                const hasSubcategories = await models_1.Category.exists({ parentId: category._id });
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
            }
            catch (error) {
                next(error);
            }
        };
    }
    // Helper method to build category tree
    buildCategoryTree(categories) {
        const categoryMap = new Map();
        const roots = [];
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
            }
            else {
                roots.push(category);
            }
        });
        return roots;
    }
}
exports.default = new CategoryController();
