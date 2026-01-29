const NodeCache = require("node-cache");
const myCache = new NodeCache({
    stdTTL: 100,
    checkperiod: 120
});

exports.get = (key) => {
    return myCache.get(key);
};

exports.set = (key, val, ttl) => {
    return myCache.set(key, val, ttl);
};

exports.del = (key) => {
    return myCache.del(key);
};

exports.flush = () => {
    return myCache.flushAll();
};

exports.middleware = (duration) => (req, res, next) => {
    // Simple cache middleware for GET requests
    if (req.method !== 'GET') {
        return next();
    }
    const key = req.originalUrl;
    const cachedResponse = myCache.get(key);

    if (cachedResponse) {
        return res.json(cachedResponse);
    } else {
        res.originalSend = res.json;
        res.json = (body) => {
            res.originalSend(body);
            myCache.set(key, body, duration);
        };
        next();
    }
};
