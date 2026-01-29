const PromotedTrend = require('../models/promotedTrend');
const Business = require('../models/business');
const Trend = require('../models/trend');

exports.createPromotion = async (req, res, next) => {
    try {
        const {
            trendId, // Existing trend to boost? Or null if creating new promoted trend
            businessId,
            adPackage, // "starter","boost","viral"
            targetRegion,
            startAt,
            endAt
        } = req.body;

        // Verify User owns business
        // const user = await User.findById(req.user.id);
        // if (user.businessId != businessId) ...

        const promotion = await PromotedTrend.create({
            trendId,
            businessId,
            adPackage,
            targetRegion,
            startAt: startAt || new Date(),
            endAt,
            active: true
        });

        // If it links to a Trend, update the Trend to show it's promoted
        // Actually the Trend model has `promotedTrendId`
        if (trendId) {
            await Trend.findByIdAndUpdate(trendId, {
                promotedTrendId: promotion._id,
                sourceType: 'promoted', // If we still used that field, but we removed it. 
                // We can rely on promotedTrendId existence.
            });
        }

        res.status(201).json({
            success: true,
            promotion
        });
    } catch (error) {
        next(error);
    }
};

exports.getActivePromotions = async (req, res, next) => {
    try {
        const now = new Date();
        const promotions = await PromotedTrend.find({
            active: true,
            startAt: {
                $lte: now
            },
            endAt: {
                $gte: now
            }
        }).populate('businessId', 'name avatarUrl');

        res.json({
            success: true,
            promotions
        });
    } catch (error) {
        next(error);
    }
};

exports.stopPromotion = async (req, res, next) => {
    try {
        const {
            id
        } = req.params;
        // Auth check...

        const promotion = await PromotedTrend.findByIdAndUpdate(id, {
            active: false
        }, {
            new: true
        });
        res.json({
            success: true,
            promotion
        });
    } catch (error) {
        next(error);
    }
};
