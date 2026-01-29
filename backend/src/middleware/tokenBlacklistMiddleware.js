const cache = require('../config/cache');

const tokenBlacklistMiddleware = async (req, res, next) => { // async kept for interface, though cache is sync
    const authHeader = req.headers.authorization;
    if (!authHeader) return next();

    const token = authHeader.split(' ')[1];
    const key = `blacklist:${token}`;

    try {
        const isBlacklisted = cache.get(key);

        if (isBlacklisted) {
            return res.status(401).json({
                success: false,
                message: 'Session expired or logged out. Please login again.'
            });
        }

        next();
    } catch (error) {
        console.error('Blacklist check failed', error);
        next();
    }
};

module.exports = tokenBlacklistMiddleware;
