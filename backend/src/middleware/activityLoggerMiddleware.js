const activityLoggerMiddleware = (req, res, next) => {
    const start = Date.now();
    const requestId = req.id || 'unknown';
    res.on('finish', () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        const valid = status >= 200 && status < 400;
        const error = status >= 400;
        let logType = console.log;
        if (error) logType = console.error;
        const statusMsg = `${status}`;
        logType(
            `[${new Date().toISOString()}] [${requestId}] ${req.method} ${req.originalUrl} - ${statusMsg} - ${duration}ms - User: ${req.user ? req.user._id : 'Guest'}`
        );
    });

    next();
};

module.exports = activityLoggerMiddleware;
