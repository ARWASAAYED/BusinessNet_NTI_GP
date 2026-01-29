const CommunityMember = require('../models/communityMember');
const communityRoleMiddleware = (requiredRoles = []) => {
    return async (req, res, next) => {
        try {
            const {
                communityId
            } = req.params;
            const userId = req.user._id;

            if (!communityId) {
                return res.status(400).json({
                    success: false,
                    message: 'Community ID required for role check.'
                });
            }

            const membership = await CommunityMember.findOne({
                communityId: communityId,
                userId: userId
            });

            if (!membership) {
                return res.status(403).json({
                    success: false,
                    message: 'You are not a member of this community.'
                });
            }

            if (!requiredRoles.includes(membership.role)) {
                return res.status(403).json({
                    success: false,
                    message: 'Insufficient community permissions.'
                });
            }
            req.communityMembership = membership;
            next();
        } catch (error) {
            console.error('Community Role Middleware Error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error verifying community role.'
            });
        }
    };
};

module.exports = communityRoleMiddleware;
