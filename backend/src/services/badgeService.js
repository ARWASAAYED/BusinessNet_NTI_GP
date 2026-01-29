const Badge = require('../models/badge');
const User = require('../models/user');
const Post = require('../models/post');
const Notification = require('../models/notification');
const Comment = require('../models/comment');

/**
 * Checks for and awards badges based on user activities.
 */
const checkAndAwardBadges = async (userId, io) => {
    try {
        const user = await User.findById(userId).populate('badges');
        if (!user) return;

        const postCount = await Post.countDocuments({ authorId: userId });
        const commentCount = await Comment.countDocuments({ author: userId });
        const followerCount = user.followers?.length || 0;
        
        const allBadges = await Badge.find();
        
        const userBadgeIds = user.badges.map(b => b._id.toString());
        const newBadges = [];

        for (const badge of allBadges) {
            if (userBadgeIds.includes(badge._id.toString())) continue;

            let earned = false;
            switch (badge.ruleKey) {
                case 'first_post':
                    if (postCount >= 1) earned = true;
                    break;
                case 'content_creator':
                    if (postCount >= 10) earned = true;
                    break;
                case 'prolific_poster':
                    if (postCount >= 50) earned = true;
                    break;
                case 'viral_hit':
                    // Check if any post has >= 100 upvotes
                    const viralPost = await Post.findOne({ 
                        authorId: userId, 
                        upvotesCount: { $gte: 100 } 
                    });
                    if (viralPost) earned = true;
                    break;
                case 'mega_viral':
                    // Check if any post has >= 1000 upvotes
                    const megaViralPost = await Post.findOne({ 
                        authorId: userId, 
                        upvotesCount: { $gte: 1000 } 
                    });
                    if (megaViralPost) earned = true;
                    break;
                case 'first_comment':
                    if (commentCount >= 1) earned = true;
                    break;
                case 'discussion_master':
                    if (commentCount >= 50) earned = true;
                    break;
                case 'popular_user':
                    if (followerCount >= 10) earned = true;
                    break;
                case 'influencer':
                    if (followerCount >= 100) earned = true;
                    break;
                case 'celebrity':
                    if (followerCount >= 1000) earned = true;
                    break;
            }

            if (earned) {
                user.badges.push(badge._id);
                newBadges.push(badge);

                // Create notification
                const notification = await Notification.create({
                    userId,
                    type: 'badge',
                    title: 'New Achievement Earned! 🏆',
                    message: `Congratulations! You've earned the "${badge.name}" badge.`,
                });

                if (io) {
                    io.to(userId.toString()).emit('notification', notification);
                }
            }
        }

        if (newBadges.length > 0) {
            await user.save();
        }

        return newBadges;
    } catch (error) {
        console.error('Failed to check and award badges:', error);
    }
};

module.exports = {
    checkAndAwardBadges
};
