const Category = require('../models/category');

exports.createCategory = async (req, res, next) => {
    try {
        const {
            name,
            description,
            parentId
        } = req.body;

        const category = await Category.create({
            name,
            description,
            parentId: parentId || null
        });

        res.status(201).json({
            success: true,
            category
        });
    } catch (error) {
        next(error);
    }
};

exports.getCategories = async (req, res, next) => {
    try {
        // Fetch hierarchy or flat list?
        // Let's return flat list with populating parent for now, or just root categories if query param?
        const {
            root
        } = req.query;
        const query = {};
        if (root === 'true') query.parentId = null;

        const categories = await Category.find(query).populate('parentId', 'name');
        res.json({
            success: true,
            categories
        });
    } catch (error) {
        next(error);
    }
};

exports.getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id).populate('parentId');
        if (!category) return res.status(404).json({
            message: 'Category not found'
        });
        res.json({
            success: true,
            category
        });
    } catch (error) {
        next(error);
    }
};

exports.updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        if (!category) return res.status(404).json({
            message: 'Category not found'
        });
        res.json({
            success: true,
            category
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        // Check for subcategories or posts before delete?
        // Simple delete for now
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({
            message: 'Category not found'
        });
        res.json({
            success: true,
            message: 'Category deleted'
        });
    } catch (error) {
        next(error);
    }
};
