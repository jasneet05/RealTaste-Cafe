"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseController {
    constructor(model) {
        this.model = model;
        // Get all items with pagination
        this.getAll = async (req, res, next) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const sort = req.query.sort || '-createdAt';
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
            }
            catch (error) {
                next(error);
            }
        };
        // Get single item by ID
        this.getOne = async (req, res, next) => {
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
            }
            catch (error) {
                next(error);
            }
        };
        // Create new item
        this.create = async (req, res, next) => {
            try {
                const item = await this.model.create(req.body);
                res.status(201).json({
                    success: true,
                    data: item
                });
            }
            catch (error) {
                next(error);
            }
        };
        // Update item
        this.update = async (req, res, next) => {
            try {
                const item = await this.model.findByIdAndUpdate(req.params.id, req.body, {
                    new: true,
                    runValidators: true
                });
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
            }
            catch (error) {
                next(error);
            }
        };
        // Delete item
        this.delete = async (req, res, next) => {
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
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = BaseController;
