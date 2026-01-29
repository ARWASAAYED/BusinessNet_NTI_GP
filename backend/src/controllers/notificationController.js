const Notification = require('../models/notification');

// Get notifications for current user
exports.getNotifications = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const notifications = await Notification.find({ userId: req.user._id })
            .populate('sender', 'username avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Notification.countDocuments({ userId: req.user._id });

        res.json({
            success: true,
            data: {
                notifications,
                hasMore: skip + notifications.length < total
            }
        });
    } catch (error) {
        next(error);
    }
};

// Mark notification as read
exports.markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.json({
            success: true,
            data: notification
        });
    } catch (error) {
        next(error);
    }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            { userId: req.user._id, isRead: false },
            { isRead: true }
        );

        res.json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        next(error);
    }
};

// Get unread count
exports.getUnreadCount = async (req, res, next) => {
    try {
        const count = await Notification.countDocuments({ userId: req.user._id, isRead: false });
        res.json({
            success: true,
            data: { count }
        });
    } catch (error) {
        next(error);
    }
};
