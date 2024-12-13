const jwt = require('jsonwebtoken');
const { logger } = require('../config/logger');

const authenticateToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('No token provided or invalid token format');
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.userId) {
      logger.warn('Token missing userId');
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token'
      });
    }

    // Add user info to request
    req.user = {
      _id: decoded.userId
    };
    
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token'
    });
  }
};

module.exports = { authenticateToken };