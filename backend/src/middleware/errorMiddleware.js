const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    console.error(`[Error] ${statusCode} - ${message}`);
    if (statusCode === 500) {
        console.error(err.stack);
    }
    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};
module.exports = errorMiddleware;
