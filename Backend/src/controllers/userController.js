const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const lowerCaseEmail = email.toLowerCase();
    
    const existingUser = await User.findOne({ email: lowerCaseEmail });
    if (existingUser) {
      return res.status(400).json({ 
        status: 400, 
        error: 'User already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
      name, 
      email: lowerCaseEmail, 
      password: hashedPassword 
    });
    
    await user.save();

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Prepare user data without sensitive information
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      type: 'user'
    };

    res.status(201).json({ 
      status: 201,
      message: 'User registered successfully',
      token,
      userData
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      status: 500, 
      error: 'Error registering user'
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const lowerCaseEmail = email.toLowerCase();
    
    const user = await User.findOne({ email: lowerCaseEmail });
    if (!user) {
      return res.status(404).json({ 
        status: 404, 
        error: 'User not found'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        status: 400, 
        error: 'Invalid credentials'
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    // Prepare user data without sensitive information
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      type: 'user'
    };

    res.status(200).json({ 
      status: 200,
      message: 'Login successful',
      token,
      userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      status: 500, 
      error: 'Error logging in user'
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // From auth middleware
    const { name, email, phoneNumber } = req.body;
    
    // Check if email is already taken by another user
    const existingUser = await User.findOne({ 
      email: email.toLowerCase(),
      _id: { $ne: userId }
    });
    
    if (existingUser) {
      return res.status(400).json({
        status: 400,
        error: 'Email is already in use'
      });
    }

    const updateData = {
      name,
      email: email.toLowerCase(),
      phoneNumber
    };

    // Handle profile image upload
    if (req.file) {
      updateData.profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: 404,
        error: 'User not found'
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Profile updated successfully',
      userData: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      status: 500,
      error: 'Error updating profile'
    });
  }
};

module.exports = {
  registerUser: exports.registerUser,
  loginUser: exports.loginUser,
  updateProfile: exports.updateProfile,
  upload
};
