// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateRegister,
  validateLogin,
  checkValidation,
} = require('../middleware/validationMiddleware');

// Public routes
router.post('/register', validateRegister, checkValidation, registerUser);
router.post('/login', validateLogin, checkValidation, loginUser);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;