const jwt = require('jsonwebtoken');
const User = require('../models/user');

/**
 * Optional authentication middleware.
 * If a valid token is provided, req.user is set.
 * If no token or invalid token, it proceeds without setting req.user.
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod');
    const user = await User.findById(decoded.id || decoded.userId).select('-passwordHash');

    if (user) {
      req.user = user;
    }
    next();
  } catch (error) {
    // On error (expired or invalid token), just proceed as guest
    next();
  }
};

module.exports = optionalAuth;
