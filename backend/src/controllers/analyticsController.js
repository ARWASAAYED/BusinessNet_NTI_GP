const Business = require('../models/business');
const Post = require('../models/post');
const mongoose = require('mongoose');

exports.getBusinessHealth = async (req, res, next) => {
  try {
    const { businessId } = req.params;
    
    // 1. Get Business Profile with reputation
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    // 2. Aggregate Post Analytics
    // We need to handle upvotes as arrays now
    const postStats = await Post.aggregate([
      { 
        $match: { 
            $or: [
                { businessId: new mongoose.Types.ObjectId(businessId) }, 
                { authorId: new mongoose.Types.ObjectId(businessId) }
            ] 
        } 
      },
      { 
        $group: {
          _id: null,
          avgProfessionalism: { $avg: '$professionalismScore' },
          avgSentiment: { $avg: '$sentimentScore' },
          totalImpressions: { $sum: '$impressions' },
          totalUpvotes: { $sum: { $size: { $ifNull: ['$upvotes', []] } } },
          topKeywords: { $push: '$aiKeywords' }
        }
      }
    ]);

    const stats = postStats.length > 0 ? postStats[0] : {
      avgProfessionalism: 0,
      avgSentiment: 0,
      totalImpressions: 0,
      totalUpvotes: 0,
      topKeywords: []
    };

    // Flatten keywords and get top 5
    const flatKeywords = stats.topKeywords.flat();
    const keywordCounts = {};
    flatKeywords.forEach(k => {
        if (k) keywordCounts[k] = (keywordCounts[k] || 0) + 1;
    });
    
    const top5Keywords = Object.entries(keywordCounts)
      .sort((a,b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);

    // 3. Update trustScore based on verified status and recent activity
    const trustScore = (business.verified ? 70 : 40) + ((stats.avgProfessionalism || 0) / 5);
    
    res.json({
      success: true,
      data: {
        reputationScore: business.reputationScore,
        reputationHistory: business.reputationHistory ? business.reputationHistory.slice(-5).reverse() : [],
        metrics: {
          professionalism: Math.round(stats.avgProfessionalism || 0),
          sentiment: stats.avgSentiment ? stats.avgSentiment.toFixed(2) : "0.00",
          trust: Math.round(Math.min(100, trustScore)),
          innovation: Math.round(business.metrics ? business.metrics.innovationScore : 0),
          engagement: stats.totalUpvotes > 0 ? Math.round((stats.totalUpvotes / Math.max(1, stats.totalImpressions)) * 100) : 0
        },
        topKeywords: top5Keywords,
        totalReach: stats.totalImpressions || 0
      }
    });
  } catch (error) {
    next(error);
  }
};
