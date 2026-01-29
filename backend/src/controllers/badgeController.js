const Badge = require('../models/badge');

// Get all available badges
exports.getAllBadges = async (req, res, next) => {
    try {
        const badges = await Badge.find();
        res.json({
            success: true,
            data: badges
        });
    } catch (error) {
        next(error);
    }
};

// Create a new badge (Admin only in real app)
exports.createBadge = async (req, res, next) => {
    try {
        const { name, description, imageUrl, ruleKey, rarity } = req.body;
        const badge = await Badge.create({
            name,
            description,
            imageUrl,
            ruleKey,
            rarity
        });

        res.status(201).json({
            success: true,
            data: badge
        });
    } catch (error) {
        next(error);
    }
};

// Get badge by ID
exports.getBadgeById = async (req, res, next) => {
    try {
        const badge = await Badge.findById(req.params.id);
        if (!badge) {
            return res.status(404).json({ message: 'Badge not found' });
        }
        res.json({
            success: true,
            data: badge
        });
    } catch (error) {
        next(error);
    }
};

exports.updateBadge = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({
            message: 'Admin only'
        });

        const badge = await Badge.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        if (!badge) return res.status(404).json({
            message: 'Badge not found'
        });
        res.json({
            success: true,
            badge
        });
    } catch (error) {
        next(error);
    }
};
