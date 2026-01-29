const Trend = require('../models/trend');
const Keyword = require('../models/keyword');
const Post = require('../models/post');

// Get global trending topics (aggregated keywords/trends)
exports.getTrendingTopics = async (req, res, next) => {
    try {
        const { status, limit, category } = req.query;
        // console.log(`[Trends] Fetching topics. Category: ${category}, Status: ${status}`);

        const query = {};
        
        if (status) query.status = status;
        
        // Populate options to filter by category on the referenced Keyword
        const populateOptions = {
            path: 'keywordId',
            match: {}
        };

        if (category && category !== 'All') {
            // Case-insensitive regex
            populateOptions.match.category = { $regex: new RegExp(category, 'i') };
        }

        // 1. Fetch Promoted Trends (Always show these on top)
        // We only want active promoted trends, check promotedTrendId
        // In a real app we would check startAt/endAt here too, but simple check for now
        let promotedTrends = await Trend.find({ 
            ...query, 
            promotedTrendId: { $ne: null },
            score: { $gte: 0 } // sanity check
        })
        .populate(populateOptions)
        .populate('postId')
        .populate('promotedTrendId')
        .sort({ score: -1 })
        .limit(3); // Limit promoted slots

        // 2. Fetch Organic Trends (High score only)
        // "didn't want show all trends" -> Filter noise
        const NOISE_THRESHOLD = 0; // Show all for now/testing
        let organicTrends = await Trend.find({ 
            ...query, 
            promotedTrendId: null,
            score: { $gt: NOISE_THRESHOLD } 
        })
        .populate(populateOptions)
        .populate('postId')
        .sort({ score: -1 })
        .limit(parseInt(limit) || 10);

        // Filter and Merge
        promotedTrends = promotedTrends.filter(t => t.keywordId);
        organicTrends = organicTrends.filter(t => t.keywordId);

        let trends = [...promotedTrends, ...organicTrends];

        // Format for frontend compatibility
        const formattedTrends = trends.map(t => {
            // Safety check: check if keywordId is actually populated or just an ID
            const isPopulated = t.keywordId && t.keywordId.word;
            const keywordWord = isPopulated ? t.keywordId.word : 'Unknown Tag';
            const keywordCategory = isPopulated ? t.keywordId.category : 'General';
            const keywordId = isPopulated ? t.keywordId._id : t.keywordId;
            
            // Get promotion details if exists
            const promotion = t.promotedTrendId || {};

            // Market Pulse Enrichment: If no change exists, simulate one based on velocity
            const pulseGrowth = t.dailyChange || (Math.random() * (t.velocity || 5) * 2).toFixed(1);
            const isNegative = Math.random() > 0.8; // 20% chance of a "dip"
            
            return {
                _id: t._id,
                name: keywordWord, 
                count: Math.round(t.score || 0),
                growth: isNegative ? -Math.abs(pulseGrowth) : Math.abs(pulseGrowth),
                isPromoted: !!t.promotedTrendId, 
                promotionLabel: promotion.adPackage ? `${promotion.adPackage} PROMOTION` : 'Promoted',
                category: keywordCategory,
                keywordId: keywordId,
                postId: t.postId,
                pulse: {
                    high: Math.round((t.score || 0) * 1.2),
                    low: Math.round((t.score || 0) * 0.8),
                    volume: t.velocity || 0
                }
            };
        });

        res.json({
            success: true,
            data: formattedTrends, // For frontend compatibility (was mockTopics)
            trends: formattedTrends // For API consistency
        });
    } catch (error) {
        console.error('[Trends] Error fetching topics:', error);
        next(error);
    }
};

// Get trending posts (Feed content)
// Get trending posts (Feed content)
// Get trending posts (Feed content)
exports.getTrendingPosts = async (req, res, next) => {
    try {
        const { category } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // console.log(`[Trends] Fetching posts. Category: ${category}, Page: ${page}`);

        const query = {
            // Only show posts with actual engagement OR promoted posts
            $or: [
                { isPromoted: true },
                { upvotesCount: { $gt: 0 } },
                { impressions: { $gt: 0 } }
            ]
        };
        
        if (category && category !== 'All') {
            const regex = new RegExp(category, 'i');
            
            // 1. Find matching hashtags IDs first
            const hashtags = await require('../models/hashtag').find({ name: regex });
            const hashtagIds = hashtags.map(h => h._id);

             // 2. Build multi-field query with engagement filter
            query.$and = [
                {
                    $or: [
                        { tag: { $regex: regex } },
                        { aiKeywords: { $regex: regex } }, 
                        { hashtags: { $in: hashtagIds } },
                        { content: { $regex: regex } }
                    ]
                },
                {
                    $or: [
                        { isPromoted: true },
                        { upvotesCount: { $gt: 0 } },
                        { impressions: { $gt: 0 } }
                    ]
                }
            ];
        }
        
        const posts = await Post.find(query)
            .populate('authorId', 'username fullName avatarUrl accountType')
            .populate('businessId', 'name avatarUrl')
            .populate('hashtags', 'name')
            .sort({ isPromoted: -1, upvotesCount: -1, impressions: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Post.countDocuments(query);

        // Format posts to match frontend expectations
        const formattedPosts = posts.map(p => {
            const obj = p.toObject();
            return {
                ...obj,
                _id: obj._id,
                content: obj.content,
                media: obj.media || [],
                author: obj.authorId ? {
                    _id: obj.authorId._id,
                    username: obj.authorId.username,
                    fullName: obj.authorId.fullName,
                    avatar: obj.authorId.avatarUrl,
                    accountType: obj.authorId.accountType
                } : null,
                business: obj.businessId ? {
                    _id: obj.businessId._id,
                    name: obj.businessId.name,
                    logo: obj.businessId.avatarUrl
                } : null,
                upvotes: obj.upvotes || [],
                downvotes: obj.downvotes || [],
                commentCount: obj.commentsCount || 0,
                shareCount: obj.shareCount || 0,
                impressions: obj.impressions || 0,
                createdAt: obj.createdAt,
                updatedAt: obj.updatedAt,
                hashtags: obj.hashtags || [],
                // AI Scores
                sentimentScore: obj.sentimentScore,
                professionalismScore: obj.professionalismScore,
                authenticityScore: obj.authenticityScore,
                relevanceScore: obj.relevanceScore,
                aiKeywords: obj.aiKeywords || []
            };
        });

        res.json({
            success: true,
            data: {
                posts: formattedPosts,
                hasMore: skip + posts.length < total
            }
        });
    } catch (error) {
        console.error('[Trends] Error fetching posts:', error);
        next(error);
    }
};

exports.getTrendById = async (req, res, next) => {
    try {
        const trend = await Trend.findById(req.params.id)
            .populate('keywordId')
            .populate('postId');

        if (!trend) return res.status(404).json({
            message: 'Trend not found'
        });

        res.json({
            success: true,
            trend
        });
    } catch (error) {
        next(error);
    }
};

// System / Admin function to calculate or update trends
exports.updateTrendStatus = async (req, res, next) => {
    try {
        // Typically restricted
        // if (req.user.role !== 'admin') ... 

        const { id } = req.params;
        const { status, score, velocity } = req.body;

        const trend = await Trend.findByIdAndUpdate(id, {
            status,
            score,
            velocity,
            lastUpdated: new Date()
        }, {
            new: true
        });

        if (!trend) return res.status(404).json({
            message: 'Trend not found'
        });

        res.json({
            success: true,
            trend
        });
    } catch (error) {
        next(error);
    }
};
