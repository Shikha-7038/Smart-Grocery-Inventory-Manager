// server/utils/validators.js
const { VALIDATION_PATTERNS } = require('../config/constants');

// Validate email format
const isValidEmail = (email) => {
  if (!email) return false;
  return VALIDATION_PATTERNS.EMAIL.test(email);
};

// Validate password strength
const isValidPassword = (password) => {
  if (!password) return false;
  return password.length >= 6;
};

// Validate name
const isValidName = (name) => {
  if (!name) return false;
  return name.length >= 2 && name.length <= 50;
};

// Validate quantity
const isValidQuantity = (quantity) => {
  return typeof quantity === 'number' && quantity >= 0 && !isNaN(quantity);
};

// Validate price
const isValidPrice = (price) => {
  return typeof price === 'number' && price >= 0 && !isNaN(price);
};

// Validate date
const isValidDate = (date) => {
  if (!date) return true; // Date is optional
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

// Validate future date (for expiry)
const isFutureDate = (date) => {
  if (!date) return true; // Date is optional
  const d = new Date(date);
  return d > new Date();
};

// Validate grocery item object
const validateGroceryItem = (item) => {
  const errors = [];
  
  if (!item.name || item.name.trim().length < 2) {
    errors.push('Item name must be at least 2 characters');
  }
  
  if (!item.category) {
    errors.push('Category is required');
  }
  
  if (!isValidQuantity(item.quantity)) {
    errors.push('Quantity must be a non-negative number');
  }
  
  if (!item.unit) {
    errors.push('Unit is required');
  }
  
  if (!isValidQuantity(item.minStockLevel)) {
    errors.push('Minimum stock level must be a non-negative number');
  }
  
  if (item.expiryDate && !isValidDate(item.expiryDate)) {
    errors.push('Invalid expiry date');
  }
  
  if (item.price && !isValidPrice(item.price)) {
    errors.push('Price must be a non-negative number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate user registration
const validateUserRegistration = (userData) => {
  const errors = [];
  
  if (!isValidName(userData.name)) {
    errors.push('Name must be between 2 and 50 characters');
  }
  
  if (!isValidEmail(userData.email)) {
    errors.push('Please provide a valid email address');
  }
  
  if (!isValidPassword(userData.password)) {
    errors.push('Password must be at least 6 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate user login
const validateUserLogin = (loginData) => {
  const errors = [];
  
  if (!isValidEmail(loginData.email)) {
    errors.push('Please provide a valid email address');
  }
  
  if (!loginData.password || loginData.password.length === 0) {
    errors.push('Password is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate ID (MongoDB ObjectId)
const isValidObjectId = (id) => {
  const ObjectId = require('mongoose').Types.ObjectId;
  return ObjectId.isValid(id);
};

// Validate pagination parameters
const validatePagination = (page, limit) => {
  const validatedPage = Math.max(1, parseInt(page) || 1);
  const validatedLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));
  return { page: validatedPage, limit: validatedLimit };
};

// Validate sort parameters
const validateSort = (sortField, sortOrder) => {
  const allowedFields = ['name', 'quantity', 'price', 'expiryDate', 'createdAt', 'category'];
  const allowedOrders = ['asc', 'desc'];
  
  const field = allowedFields.includes(sortField) ? sortField : 'createdAt';
  const order = allowedOrders.includes(sortOrder) ? sortOrder : 'desc';
  
  return { field, order };
};

// Sanitize input (basic XSS prevention)
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim();
};

// Validate expiry date update
const validateExpiryUpdate = (expiryDate, currentQuantity) => {
  const warnings = [];
  
  if (expiryDate && !isFutureDate(expiryDate)) {
    warnings.push('Expiry date is in the past');
  }
  
  if (currentQuantity === 0 && expiryDate && isFutureDate(expiryDate)) {
    warnings.push('Item is out of stock but has future expiry date');
  }
  
  return warnings;
};

// Validate bulk operations
const validateBulkOperation = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return { isValid: false, errors: ['No items provided for bulk operation'] };
  }
  
  if (items.length > 100) {
    return { isValid: false, errors: ['Cannot process more than 100 items at once'] };
  }
  
  return { isValid: true, errors: [] };
};

// Validate alert thresholds
const validateAlertThreshold = (threshold) => {
  if (typeof threshold !== 'number' || isNaN(threshold)) {
    return 3; // default
  }
  return Math.max(1, Math.min(30, threshold)); // between 1 and 30 days
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidQuantity,
  isValidPrice,
  isValidDate,
  isFutureDate,
  validateGroceryItem,
  validateUserRegistration,
  validateUserLogin,
  isValidObjectId,
  validatePagination,
  validateSort,
  sanitizeInput,
  validateExpiryUpdate,
  validateBulkOperation,
  validateAlertThreshold,
};