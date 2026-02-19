const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('🔑 Token received in middleware');
    }

    if (!token) {
      console.log('🚫 No token provided');
      return res.status(401).json({
        status: 'fail',
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token verified for user:', decoded.id);

      // Get user from token
      const user = await AdminUser.findById(decoded.id);
      
      if (!user) {
        console.log('🚫 User not found for token');
        return res.status(401).json({
          status: 'fail',
          message: 'User not found'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.log('🚫 Token verification failed:', error.message);
      return res.status(401).json({
        status: 'fail',
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

module.exports = { protect };