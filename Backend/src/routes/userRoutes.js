const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { upload } = require('../controllers/userController');

const router = express.Router();

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes
router.put('/profile',
  authenticateToken,
  upload.single('profileImage'),
  userController.updateProfile
);

module.exports = router;