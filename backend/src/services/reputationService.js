const Business = require('../models/business');
const Post = require('../models/Post');

/**
 * Recalculates business reputation metrics based on activity and AI feedback.
 */
const updateBusinessMetrics = async (businessId) => {
    try {
        const business = await Business.findById(businessId);
        if (!business) return;

        // Fetch recent posts and interactions
        const posts = await Post.find({ businessId }).sort({ createdAt: -1 }).limit(50);
        
        if (posts.length === 0) return;

        // 1. Engagement Rate Calculation
        const totalImpressions = posts.reduce((sum, p) => sum + (p.impressions || 0), 0);
        const totalEngagements = posts.reduce((sum, p) => sum + (p.upvotes?.length || 0) + (p.commentsCount || 0), 0);
        const engagementRate = totalImpressions > 0 ? (totalEngagements / totalImpressions) * 100 : 0;

        // 2. Trust Score (Based on Sentiment and Professionalism)
        const avgProfessionalism = posts.reduce((sum, p) => sum + (p.professionalismScore || 0), 0) / posts.length;
        const avgSentiment = posts.reduce((sum, p) => sum + (p.sentimentScore || 0), 0) / posts.length;
        // Sentiment is -1 to 1, map to 0-100
        const trustScore = (avgProfessionalism * 0.7) + (((avgSentiment + 1) * 50) * 0.3);

        // 3. Innovation Score (Based on AI Keywords and growth)
        const uniqueKeywords = new Set(posts.flatMap(p => p.aiKeywords || []));
        const innovationScore = Math.min(100, uniqueKeywords.size * 5);

        // 4. AIScore
        const avgAIScore = posts.reduce((sum, p) => sum + (p.authenticityScore || 0) * 100, 0) / posts.length;

        // Update business
        business.metrics = {
            trustScore: Math.round(trustScore),
            innovationScore: Math.round(innovationScore),
            engagementRate: parseFloat(engagementRate.toFixed(2)),
            aiAuditScore: Math.round(avgAIScore)
        };

        // Final Reputation Score (weighted average)
        business.reputationScore = Math.round(
            (business.metrics.trustScore * 0.4) +
            (business.metrics.innovationScore * 0.2) +
            (Math.min(100, business.metrics.engagementRate * 10) * 0.2) +
            (business.metrics.aiAuditScore * 0.2)
        );

        await business.save();
        return business;
    } catch (error) {
        console.error('Failed to update business metrics:', error);
    }
};

module.exports = {
    updateBusinessMetrics
};
