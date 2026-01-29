const roleMiddleware = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized. User context missing.'
            });
        }
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden. specific role required.`
            });
        }
        next();
    };
};
module.exports = roleMiddleware;
