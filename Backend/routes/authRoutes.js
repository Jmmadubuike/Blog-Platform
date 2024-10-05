const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Log in user and get token
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/auth/profile
// @desc    Get logged-in user profile
// @access  Private (Protected by JWT)
router.get('/profile', authMiddleware, getUserProfile);

module.exports = router;
