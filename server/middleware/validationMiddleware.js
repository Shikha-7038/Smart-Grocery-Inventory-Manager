// server/middleware/validationMiddleware.js
const { body, validationResult } = require('express-validator');

// Validation rules for user registration
const validateRegister = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

// Validation rules for user login
const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Validation rules for grocery item
const validateGroceryItem = [
  body('name').notEmpty().withMessage('Item name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('quantity')
    .isNumeric()
    .withMessage('Quantity must be a number')
    .custom((value) => value >= 0)
    .withMessage('Quantity cannot be negative'),
  body('minStockLevel')
    .isNumeric()
    .withMessage('Minimum stock level must be a number')
    .custom((value) => value >= 0)
    .withMessage('Minimum stock level cannot be negative'),
  body('unit').notEmpty().withMessage('Unit is required'),
];

// Middleware to check validation results
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateGroceryItem,
  checkValidation,
};