const Trend = require('../models/trend');
const Keyword = require('../models/keyword');
const Post = require('../models/post');

// Get global trending topics (aggregated keywords/trends)
exports.getTrendingTopics = async (req, res, next) => {
    try {
        const { status, limit, category } = req.query;
        const Hashtag = require('../models/hashtag');

        const query = {};
        if (status) query.status = status;

        let matchingKeywordIds = [];
        if (category && category !== 'All') {
            const catRegex = new RegExp(`^${category}$|${category}`, 'i');
            
            // 1. Direct keywords with matching category or word
            const directKeywords = await Keyword.find({
                $or: [{ category: catRegex }, { word: catRegex }]
            }).select('_id word');

            // 2. Hashtags from posts in this category
            const categoryPosts = await Post.find({
                $or: [
                    { tag: catRegex },
                    { aiKeywords: catRegex },
                    { content: new RegExp(category, 'i') }
                ]
            }).select('hashtags');

            const postHashtagIds = categoryPosts.flatMap(p => p.hashtags || []);
            const postHashtags = await Hashtag.find({ _id: { $in: postHashtagIds } }).select('name');
            const postWords = postHashtags.map(h => h.name);

            const hashtagKeywords = await Keyword.find({
                word: { $in: postWords.map(w => new RegExp(`^${w}$`, 'i')) }
            }).select('_id word');

            const allKwIds = new Set([
                ...directKeywords.map(k => k._id.toString()),
                ...hashtagKeywords.map(k => k._id.toString())
            ]);

            matchingKeywordIds = Array.from(allKwIds);
            if (matchingKeywordIds.length > 0) {
                query.keywordId = { $in: matchingKeywordIds };
            }
        }

        // 1. Fetch Promoted Trends
        let promotedTrends = await Trend.find({ 
            ...query, 
            promotedTrendId: { $ne: null },
            score: { $gte: 0 }
        })
        .populate('keywordId')
        .populate('postId')
        .populate('promotedTrendId')
        .sort({ score: -1 })
        .limit(3);

        // 2. Fetch Organic Trends
        let organicTrends = await Trend.find({ 
            ...query, 
            promotedTrendId: null,
            score: { $gt: 0 } 
        })
        .populate('keywordId')
        .populate('postId')
        .sort({ score: -1 })
        .limit(parseInt(limit) || 10);

        // Filter valid keyword populations
        promotedTrends = promotedTrends.filter(t => t.keywordId && t.keywordId.word);
        organicTrends = organicTrends.filter(t => t.keywordId && t.keywordId.word);

        let trends = [...promotedTrends, ...organicTrends];

        // Fallback: If no Trend records exist yet for this category, fetch directly from category posts or keywords
        if (trends.length === 0 && category && category !== 'All') {
            const catRegex = new RegExp(category, 'i');
            const categoryPosts = await Post.find({
                $or: [
                    { tag: catRegex },
                    { aiKeywords: catRegex },
                    { content: new RegExp(category, 'i') }
                ]
            }).select('hashtags');

            const postHashtagIds = categoryPosts.flatMap(p => p.hashtags || []);
            const catHashtags = await Hashtag.find({ _id: { $in: postHashtagIds } }).sort({ count: -1 }).limit(10);
            const fallbackKeywords = await Keyword.find({
                $or: [{ category: catRegex }, { word: catRegex }]
            }).sort({ frequency: -1 }).limit(10);

            const categoryDefaults = {
                Technology: ['AI', 'TechTrends', 'WebDev', 'CloudComputing', 'CyberSecurity', 'MachineLearning', 'Innovation'],
                Business: ['Startup', 'Leadership', 'VentureCapital', 'BusinessGrowth', 'Innovation', 'Management'],
                Finance: ['FinTech', 'Investment', 'Crypto', 'Banking', 'PersonalFinance', 'WealthManagement'],
                Design: ['UIUX', 'ProductDesign', 'WebDesign', 'DesignSystem', 'CreativeDirection', 'GraphicDesign'],
                Marketing: ['DigitalMarketing', 'ContentStrategy', 'SEO', 'Branding', 'SocialMedia', 'GrowthHacking']
            };

            const defaultList = categoryDefaults[category] || [category, `${category}Trends`, `${category}Pro`];

            const combined = [
                ...catHashtags.map(h => ({ name: h.name, count: h.count })),
                ...fallbackKeywords.map(k => ({ name: k.word, count: k.frequency })),
                ...defaultList.map((d, i) => ({ name: d, count: 65 - (i * 7) }))
            ];

            const seen = new Set();
            const uniqueItems = [];
            for (const item of combined) {
                const lower = item.name.toLowerCase();
                if (!seen.has(lower)) {
                    seen.add(lower);
                    uniqueItems.push(item);
                }
            }

            const formattedFallback = uniqueItems.slice(0, parseInt(limit) || 10).map((kw, idx) => ({
                _id: `fallback-${category}-${idx}`,
                name: kw.name,
                count: kw.count || Math.floor(Math.random() * 80) + 20,
                growth: parseFloat((14.5 - (idx * 1.8)).toFixed(1)),
                isPromoted: false,
                category: category,
                keywordId: `kw-${category}-${idx}`,
                pulse: {
                    high: Math.round((kw.count || 50) * 1.2),
                    low: Math.round((kw.count || 50) * 0.8),
                    volume: 6 + idx
                }
            }));

            return res.json({
                success: true,
                data: formattedFallback,
                trends: formattedFallback
            });
        }

        // Format for frontend compatibility
        const formattedTrends = trends.map(t => {
            const isPopulated = t.keywordId && t.keywordId.word;
            const keywordWord = isPopulated ? t.keywordId.word : 'Trending Tag';
            const keywordCategory = isPopulated ? t.keywordId.category : 'General';
            const keywordId = isPopulated ? t.keywordId._id : t.keywordId;
            const promotion = t.promotedTrendId || {};
            const pulseGrowth = t.dailyChange || (Math.random() * (t.velocity || 5) * 2).toFixed(1);
            const isNegative = Math.random() > 0.8;
            
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
            data: formattedTrends,
            trends: formattedTrends
        });
    } catch (error) {
        console.error('[Trends] Error fetching topics:', error);
        next(error);
    }
};

// Get trending posts (Feed content)
exports.getTrendingPosts = async (req, res, next) => {
    try {
        const { category } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let query = {};
        
        if (category && category !== 'All') {
            const regex = new RegExp(category, 'i');
            
            // 1. Find matching hashtags IDs first
            const hashtags = await require('../models/hashtag').find({ name: regex });
            const hashtagIds = hashtags.map(h => h._id);

            // 2. Build multi-field query matching the category
            query = {
                $or: [
                    { tag: { $regex: regex } },
                    { aiKeywords: { $regex: regex } }, 
                    { hashtags: { $in: hashtagIds } },
                    { content: { $regex: regex } }
                ]
            };
        }
        
        // Recency-weighted trending: posts from the last 30 days get highest priority
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentCount = await Post.countDocuments({ ...query, createdAt: { $gte: thirtyDaysAgo } });

        let sortCriteria;
        if (recentCount >= 3) {
            query.createdAt = { $gte: thirtyDaysAgo };
            sortCriteria = { isPromoted: -1, upvotesCount: -1, impressions: -1, createdAt: -1 };
        } else {
            // Sort by freshness first so older posts do not dominate
            sortCriteria = { isPromoted: -1, createdAt: -1, upvotesCount: -1 };
        }
        
        const posts = await Post.find(query)
            .populate('authorId', 'username fullName avatarUrl accountType')
            .populate('businessId', 'name avatarUrl')
            .populate('hashtags', 'name')
            .sort(sortCriteria)
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
