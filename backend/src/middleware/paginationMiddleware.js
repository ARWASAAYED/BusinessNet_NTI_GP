const paginationMiddleware = (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const safeLimit = Math.min(limit, 100);
    const skip = (page - 1) * safeLimit;

    req.pagination = {
        page,
        limit: safeLimit,
        skip
    };

    next();
};

module.exports = paginationMiddleware;
