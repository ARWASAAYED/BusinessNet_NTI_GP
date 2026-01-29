const Promotion = require("../models/promotion");
const Post = require("../models/post");
const PromotedTrend = require('../models/promotedTrend');
const Trend = require('../models/trend');

exports.createPromotion = async (req, res) => {
  try {
    console.log('[Promotion] Create request:', req.body);
    console.log('[Promotion] User:', { id: req.user._id, businessId: req.user.businessId, accountType: req.user.accountType });
    
    const { postId, budget, duration, targetRegion, targetCategory } = req.body;
    
    // Validation
    if (!postId) {
      return res.status(400).json({ success: false, message: "Post ID is required" });
    }
    if (!budget || budget <= 0) {
      return res.status(400).json({ success: false, message: "Valid budget is required" });
    }
    if (!duration || duration <= 0) {
      return res.status(400).json({ success: false, message: "Valid duration is required" });
    }
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Get businessId - try multiple approaches
    let businessId = req.user.businessId;
    
    // If user doesn't have businessId directly, look for their Business profile
    if (!businessId) {
      console.log('[Promotion] No businessId on user, searching for Business profile...');
      const Business = require('../models/business');
      const business = await Business.findOne({ userId: req.user._id });
      
      if (business) {
        businessId = business._id;
        console.log('[Promotion] Found business:', businessId);
      } else {
        console.log('[Promotion] No business found for user');
        return res.status(400).json({ 
          success: false, 
          message: "You must create a business profile before creating promotions. Please go to Business page and create your profile first." 
        });
      }
    }

    console.log('[Promotion] Using businessId:', businessId);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(duration));

    const promotionData = {
      postId,
      businessId,
      budget: parseFloat(budget),
      duration: parseInt(duration),
      endDate,
      targetRegion: targetRegion || 'global',
      status: 'active',
      spent: 0,
      analytics: {
        impressions: 0,
        clicks: 0,
        conversions: 0
      }
    };

    // Only add targetCategory if it's provided and valid
    if (targetCategory && targetCategory !== '' && targetCategory !== 'undefined' && targetCategory !== 'null') {
      promotionData.targetCategory = targetCategory;
    }

    console.log('[Promotion] Creating with data:', promotionData);

    const promotion = await Promotion.create(promotionData);

    // Mark post as promoted
    post.isPromoted = true;
    await post.save();

    console.log('[Promotion] Successfully created:', promotion._id);

    res.status(201).json({ success: true, data: promotion });
  } catch (error) {
    console.error('[Promotion] Error creating promotion:', error);
    console.error('[Promotion] Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getPromotions = async (req, res) => {
  try {
    console.log('[Promotion] Get promotions for user:', { id: req.user._id, businessId: req.user.businessId, role: req.user.role });
    
    let query = {};
    
    if (req.user.role === 'admin') {
      // Admins see all promotions
      query = {};
    } else {
      // Get businessId - same logic as createPromotion
      let businessId = req.user.businessId;
      
      if (!businessId) {
        const Business = require('../models/business');
        const business = await Business.findOne({ userId: req.user._id });
        
        if (business) {
          businessId = business._id;
          console.log('[Promotion] Found business for user:', businessId);
        } else {
          console.log('[Promotion] No business found for user');
          // Return empty array if no business exists
          return res.status(200).json({ success: true, data: [] });
        }
      }
      
      query = { businessId };
      console.log('[Promotion] Querying with businessId:', businessId);
    }
    
    const promotions = await Promotion.find(query)
      .populate('postId')
      .sort({ createdAt: -1 });
      
    console.log('[Promotion] Found promotions:', promotions.length);
    
    res.status(200).json({ success: true, data: promotions });
  } catch (error) {
    console.error('[Promotion] Error getting promotions:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id).populate('postId');
    if (!promotion) {
      return res.status(404).json({ success: false, message: "Promotion not found" });
    }
    res.status(200).json({ success: true, data: promotion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPromotionAnalytics = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ success: false, message: "Promotion not found" });
    }

    // Generate mock analytics data based on history for demonstration
    const analytics = {
      impressions: promotion.analytics.impressions || Math.floor(promotion.spent * 150),
      clicks: promotion.analytics.clicks || Math.floor(promotion.spent * 12),
      ctr: ((promotion.analytics.clicks || 1) / (promotion.analytics.impressions || 1) * 100).toFixed(2),
      conversions: promotion.analytics.conversions || Math.floor(promotion.spent * 2),
      spent: promotion.spent,
      remaining: promotion.budget - promotion.spent,
      roi: (Math.random() * 2 + 2).toFixed(1) // Random ROI between 2x and 4x
    };

    res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.pausePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      { status: 'paused' },
      { new: true }
    );
    res.status(200).json({ success: true, data: promotion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resumePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      { status: 'active' },
      { new: true }
    );
    res.status(200).json({ success: true, data: promotion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Promoted Trend Logic ---

exports.createTrendPromotion = async (req, res, next) => {
    try {
        const {
            trendId,
            businessId,
            adPackage,
            targetRegion,
            startAt,
            endAt
        } = req.body;

        const promotion = await PromotedTrend.create({
            trendId,
            businessId,
            adPackage,
            targetRegion,
            startAt: startAt || new Date(),
            endAt,
            active: true
        });

        if (trendId) {
            await Trend.findByIdAndUpdate(trendId, {
                promotedTrendId: promotion._id,
                sourceType: 'promoted', 
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

exports.getActiveTrendPromotions = async (req, res, next) => {
    try {
        const now = new Date();
        const promotions = await PromotedTrend.find({
            active: true,
            startAt: { $lte: now },
            endAt: { $gte: now }
        }).populate('businessId', 'name avatarUrl');

        res.json({
            success: true,
            promotions
        });
    } catch (error) {
        next(error);
    }
};

exports.stopTrendPromotion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const promotion = await PromotedTrend.findByIdAndUpdate(id, {
            active: false
        }, { new: true });
        res.json({
            success: true,
            promotion
        });
    } catch (error) {
        next(error);
    }
};
