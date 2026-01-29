const Business = require("../models/business");
const Post = require("../models/post");
const Promotion = require("../models/promotion");
const mongoose = require("mongoose");

exports.getBusinessProfile = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res
        .status(404)
        .json({ success: false, message: "Business not found" });
    }
    res.status(200).json({ success: true, data: business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.searchBusinesses = async (req, res) => {
  try {
    const { q, category } = req.query;
    const query = {};

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      query.industry = category;
    }

    const businesses = await Business.find(query).limit(20);
    res.status(200).json({ success: true, data: businesses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBusinessesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = category && category !== "All" ? { industry: category } : {};
    const businesses = await Business.find(query)
      .sort({ reputationScore: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Business.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        businesses,
        hasMore: skip + businesses.length < total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserBusinesses = async (req, res) => {
  try {
    const { userId } = req.params;
    const businesses = await Business.find({ userId });
    res.status(200).json({ success: true, data: businesses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.followBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business)
      return res.status(404).json({ message: "Business not found" });

    const userId = req.user._id;

    // Check if user already follows
    if (business.followers.includes(userId)) {
      return res
        .status(400)
        .json({ message: "Already following this business" });
    }

    // Add follower
    business.followers.push(userId);
    await business.save();

    res.json({
      success: true,
      message: "Followed successfully",
      data: business,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBusinessProfile = async (req, res) => {
  try {
    const updates = req.body;

    // Handle file uploads
    if (req.files) {
      if (req.files['logo'] && req.files['logo'][0]) {
        updates.logo = `/uploads/${req.files['logo'][0].filename}`;
      }
      if (req.files['coverImage'] && req.files['coverImage'][0]) {
        updates.coverImage = `/uploads/${req.files['coverImage'][0].filename}`;
      }
    }

    // Parse JSON fields if they come as strings
    if (typeof updates.address === 'string') {
      try { updates.address = JSON.parse(updates.address); } catch (e) {}
    }
    if (typeof updates.socialLinks === 'string') {
      try { updates.socialLinks = JSON.parse(updates.socialLinks); } catch (e) {}
    }

    // Dynamic keyword extraction from description
    if (updates.description) {
      // Simple extraction: split, filter common words, take top 5 unique
      const words = updates.description.split(/\s+/);
      const stopWords = new Set(['the', 'and', 'or', 'a', 'an', 'to', 'of', 'in', 'for', 'with', 'on', 'at', 'is', 'are']);
      const keywords = [...new Set(words
        .map(w => w.toLowerCase().replace(/[^a-z0-9]/g, ''))
        .filter(w => w.length > 3 && !stopWords.has(w))
      )].slice(0, 5);
      
      // We could update keywords here if we had a field
    }

    // Handle Hashtags (comma separated string)
    if (updates.hashtags && typeof updates.hashtags === 'string') {
        const Hashtag = require("../models/hashtag");
        const Keyword = require("../models/keyword"); // Keyword Integration

        const tagNames = updates.hashtags.split(',').map(t => t.trim().replace(/^#/, '').toLowerCase()).filter(t => t);
        const uniqueTags = [...new Set(tagNames)];
        const hashtagIds = [];

        for (const name of uniqueTags) {
            // 1. Hashtag
            let tag = await Hashtag.findOne({ name });
            if (!tag) {
                tag = await Hashtag.create({ name, count: 1 });
            } else {
                tag.count += 1; 
                await tag.save();
            }
            hashtagIds.push(tag._id);

            // 2. Keyword Sync
            try {
                let keyword = await Keyword.findOne({ word: name });
                if (keyword) {
                    keyword.frequency += 1;
                    keyword.lastUpdated = Date.now();
                    await keyword.save();
                } else {
                    await Keyword.create({
                        word: name,
                        frequency: 1,
                        lastUpdated: Date.now()
                    });
                }
            } catch (err) {
                 console.error("Error syncing keyword in business update:", err);
            }
        }
        updates.hashtags = hashtagIds;
    }

    const business = await Business.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('hashtags', 'name');
    
    if (!business) {
      return res
        .status(404)
        .json({ success: false, message: "Business not found" });
    }
    res.status(200).json({ success: true, data: business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addOffering = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res
        .status(404)
        .json({ success: false, message: "Business not found" });
    }

    business.offerings.push({ name, description, price, category });
    await business.save();

    res.status(201).json({ success: true, data: business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeOffering = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res
        .status(404)
        .json({ success: false, message: "Business not found" });
    }

    business.offerings = business.offerings.filter(
      (o) => o._id.toString() !== req.params.offeringId
    );
    await business.save();

    res.status(200).json({ success: true, data: business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find();
    res.status(200).json({ success: true, data: businesses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const { id } = req.params; // businessId
    const business = await Business.findById(id);
    if (!business) return res.status(404).json({ message: "Business not found" });

    // Aggregate stats from posts
    const postStats = await Post.aggregate([
      { $match: { businessId: new mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: null,
          totalImpressions: { $sum: "$impressions" },
          totalUpvotes: { $sum: { $size: "$upvotes" } },
          totalDownvotes: { $sum: { $size: "$downvotes" } },
          totalComments: { $sum: "$commentsCount" },
          totalShares: { $sum: "$shareCount" },
          totalPosts: { $sum: 1 }
        }
      }
    ]);

    // Aggregate stats from promotions
    const promotionStats = await Promotion.aggregate([
      { $match: { businessId: new mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$spent" },
          totalPromoImpressions: { $sum: "$analytics.impressions" },
          totalClicks: { $sum: "$analytics.clicks" },
          activeCampaigns: { 
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } 
          }
        }
      }
    ]);

    const stats = postStats[0] || {
      totalImpressions: 0,
      totalUpvotes: 0,
      totalDownvotes: 0,
      totalComments: 0,
      totalShares: 0,
      totalPosts: 0
    };

    const promo = promotionStats[0] || {
      totalSpent: 0,
      totalPromoImpressions: 0,
      totalClicks: 0,
      activeCampaigns: 0
    };

    res.json({
      success: true,
      data: {
        ...stats,
        ...promo,
        reputationScore: business.reputationScore,
        followersCount: business.followers.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPostPerformance = async (req, res) => {
  try {
    const { id } = req.params; // businessId
    const posts = await Post.find({ businessId: id })
      .select("content impressions upvotesCount commentsCount shareCount createdAt isTrending")
      .sort({ impressions: -1 })
      .limit(10);

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
