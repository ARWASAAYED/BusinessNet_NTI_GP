const cache = require('../config/cache');

const rateLimitMiddleware = (limit = 100, windowSeconds = 60) => {
    return (req, res, next) => {
        const ip = req.ip;
        const key = `rate_limit:${ip}`;

        // Get current count
        let requests = cache.get(key);

        if (requests === undefined) {
            // If not exists, set to 1 with TTL
            cache.set(key, 1, windowSeconds);
            requests = 1;
        } else {
            // Increment
            requests = requests + 1;
            // TTL is preserved by getting and re-setting? node-cache ttl can be updated.
            // Actually, simplest is just udpating value. The TTL continues to tick down unless we reset it.
            // But we often want fixed window from first request.
            // node-cache doesn't have straight INCR.
            // We use 'ttl' method to get remaining time to avoid resetting it?
            // Actually, we can just set it again. If we want "fixed window", we keep original expiry.
            const currentTtl = cache.getTtl(key); // Returns timestamp or 0 or undefined
            // Provide no TTL to keep existing? No, set overwrites.
            // Let's just update value and reset TTL if we wanted sliding window, or calculate remaining.

            // To keep simple fixed window:
            let remainingTtl = 0;
            if (currentTtl) {
                remainingTtl = (currentTtl - Date.now()) / 1000;
                if (remainingTtl < 0) remainingTtl = 1;
            } else {
                remainingTtl = windowSeconds;
            }
            cache.set(key, requests, Math.ceil(remainingTtl));
        }

        if (requests > limit) {
            const currentTtl = cache.getTtl(key) || Date.now();
            const retryAfter = Math.ceil((currentTtl - Date.now()) / 1000);
            return res.status(429).json({
                success: false,
                message: 'Too many requests, please try again later.',
                retryAfter: retryAfter
            });
        }

        res.setHeader('X-RateLimit-Limit', limit);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - requests));
        next();
    };
};
module.exports = rateLimitMiddleware;
