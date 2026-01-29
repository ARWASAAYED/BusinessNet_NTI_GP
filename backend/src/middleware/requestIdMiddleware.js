const crypto = require('crypto');
const requestIdMiddleware = (req, res, next) => {
    const requestId = req.headers['x-request-id'] || crypto.randomUUID();
    req.id = requestId;
    res.setHeader('X-Request-ID', requestId);

    next();
};

module.exports = requestIdMiddleware;
