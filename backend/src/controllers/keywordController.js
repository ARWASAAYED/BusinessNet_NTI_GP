const Keyword = require('../models/keyword');

exports.getAllKeywords = async (req, res, next) => {
    try {
        const {
            sort = 'frequency', limit = 50
        } = req.query;
        // Sort options: frequency, growthRate, avgSentiment

        const sortObj = {};
        sortObj[sort] = -1;

        const keywords = await Keyword.find()
            .sort(sortObj)
            .limit(parseInt(limit));

        res.json({
            success: true,
            keywords
        });
    } catch (error) {
        next(error);
    }
};

exports.getKeywordStats = async (req, res, next) => {
    try {
        const keyword = await Keyword.findById(req.params.id);
        if (!keyword) return res.status(404).json({
            message: 'Keyword not found'
        });
        res.json({
            success: true,
            keyword
        });
    } catch (error) {
        next(error);
    }
};

// Internal/System use mostly - or via Analytics service
exports.updateKeywordStats = async (req, res, next) => {
    try {
        // if (!req.user.isAdminOrSystem) ... 

        const {
            id
        } = req.params;
        const {
            frequency,
            growthRate,
            avgSentiment,
            hypeProbability
        } = req.body;

        const keyword = await Keyword.findByIdAndUpdate(id, {
            frequency,
            growthRate,
            avgSentiment,
            hypeProbability,
            lastUpdated: new Date()
        }, {
            new: true
        });

        res.json({
            success: true,
            keyword
        });
    } catch (error) {
        next(error);
    }
};
