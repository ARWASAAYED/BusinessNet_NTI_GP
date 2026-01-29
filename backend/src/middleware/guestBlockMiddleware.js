const guestBlockMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'guest') {
        return res.status(403).json({
            success: false,
            message: 'Guest accounts are restricted from this action. Please register to continue.',
            code: 'GUEST_RESTRICTION'
        });
    }
    next();
};

module.exports = guestBlockMiddleware;
