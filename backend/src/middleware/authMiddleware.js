const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. No token provided.'
            });
        }
        const token = authHeader.split(' ')[1];
        if (!process.env.JWT_SECRET) {
            console.warn('JWT_SECRET is not defined in environment variables.');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod');
        const user = await User.findById(decoded.id || decoded.userId).select('-passwordHash');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found or invalid token.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired.'
            });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }

        console.error('Auth Middleware Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during authentication.'
        });
    }
};

module.exports = authMiddleware;
