const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

// @desc    Register admin user
// @route   POST /api/auth/register
// @access  Public (should be restricted in production)
const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide username and password'
      });
    }

    // Check if user exists
    const userExists = await AdminUser.findOne({ username });        

    if (userExists) {
      return res.status(400).json({
        status: 'fail',
        message: 'Admin user already exists'
      });
    }

    // Create user
    const user = await AdminUser.create({
      username,
      password
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          username: user.username
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Failed to register admin',
      error: error.message
    });
  }
};

// @desc    Login admin user
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide username and password'
      });
    }

    // IMPORTANT FIX: We need to explicitly select '+password' because it's set to select:false in schema
    console.log('🔍 Attempting login for username:', username);
    
    const user = await AdminUser.findOne({ username }).select('+password');

    console.log('👤 User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid credentials'
      });
    }

    console.log('🔐 Comparing passwords...');
    const isPasswordValid = await user.comparePassword(password);
    console.log('🔐 Password valid:', isPasswordValid ? '✅ Yes' : '❌ No');

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          username: user.username
        }
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(400).json({
      status: 'error',
      message: 'Failed to login',
      error: error.message
    });
  }
};

// @desc    Get current logged in admin
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.user.id);

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          username: user.username
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Failed to get user data',
      error: error.message
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getMe
};