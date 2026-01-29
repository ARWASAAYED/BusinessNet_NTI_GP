const mongoose = require('mongoose');
const ownershipMiddleware = (Model, resourceIdParam = 'id', ownerField = 'authorId') => {
    return async (req, res, next) => {
        try {
            const resourceId = req.params[resourceIdParam];
            if (!mongoose.Types.ObjectId.isValid(resourceId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid resource ID.'
                });
            }
            const resource = await Model.findById(resourceId);
            if (!resource) {
                return res.status(404).json({
                    success: false,
                    message: 'Resource not found.'
                });
            }
            const resourceOwnerId = resource[ownerField].toString();
            const currentUserId = req.user._id.toString();
            if (resourceOwnerId !== currentUserId && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to modify this resource.'
                });
            }
            req.resource = resource;
            next();
        } catch (error) {
            console.error('Ownership Middleware Error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error verifying ownership.'
            });
        }
    };
};

module.exports = ownershipMiddleware;
