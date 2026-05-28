// client/src/utils/validation.js

// Validate item name
export const validateItemName = (name) => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, message: 'Item name is required' };
  }
  if (name.length < 2) {
    return { isValid: false, message: 'Item name must be at least 2 characters' };
  }
  if (name.length > 100) {
    return { isValid: false, message: 'Item name must be less than 100 characters' };
  }
  return { isValid: true, message: '' };
};

// Validate quantity
export const validateQuantity = (quantity) => {
  const qty = parseFloat(quantity);
  if (isNaN(qty)) {
    return { isValid: false, message: 'Quantity must be a number' };
  }
  if (qty < 0) {
    return { isValid: false, message: 'Quantity cannot be negative' };
  }
  return { isValid: true, message: '' };
};

// Validate price
export const validatePrice = (price) => {
  const p = parseFloat(price);
  if (isNaN(p)) {
    return { isValid: false, message: 'Price must be a number' };
  }
  if (p < 0) {
    return { isValid: false, message: 'Price cannot be negative' };
  }
  return { isValid: true, message: '' };
};

// Validate expiry date
export const validateExpiryDate = (date) => {
  if (!date) return { isValid: true, message: '' };
  
  const expiryDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (isNaN(expiryDate.getTime())) {
    return { isValid: false, message: 'Invalid date format' };
  }
  
  if (expiryDate < today) {
    return { isValid: false, message: 'Expiry date must be in the future' };
  }
  
  return { isValid: true, message: '' };
};

// Validate minimum stock level
export const validateMinStockLevel = (minStockLevel, quantity) => {
  const min = parseFloat(minStockLevel);
  const qty = parseFloat(quantity);
  
  if (isNaN(min)) {
    return { isValid: false, message: 'Minimum stock level must be a number' };
  }
  if (min < 0) {
    return { isValid: false, message: 'Minimum stock level cannot be negative' };
  }
  if (!isNaN(qty) && min > qty * 2) {
    return { isValid: true, warning: 'Minimum stock level is very high compared to current stock' };
  }
  
  return { isValid: true, message: '' };
};

// Validate category
export const validateCategory = (category, categories) => {
  if (!category) {
    return { isValid: false, message: 'Category is required' };
  }
  if (!categories.includes(category)) {
    return { isValid: false, message: 'Invalid category selected' };
  }
  return { isValid: true, message: '' };
};

// Validate unit
export const validateUnit = (unit, units) => {
  if (!unit) {
    return { isValid: false, message: 'Unit is required' };
  }
  if (!units.includes(unit)) {
    return { isValid: false, message: 'Invalid unit selected' };
  }
  return { isValid: true, message: '' };
};

// Validate email
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  return { isValid: true, message: '' };
};

// Validate password
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters' };
  }
  return { isValid: true, message: '' };
};

// Validate confirm password
export const validateConfirmPassword = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' };
  }
  return { isValid: true, message: '' };
};

// Validate name
export const validateName = (name) => {
  if (!name) {
    return { isValid: false, message: 'Name is required' };
  }
  if (name.length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters' };
  }
  if (name.length > 50) {
    return { isValid: false, message: 'Name must be less than 50 characters' };
  }
  return { isValid: true, message: '' };
};

// Complete grocery item validation
export const validateGroceryItem = (item, categories, units) => {
  const errors = {};
  
  const nameValidation = validateItemName(item.name);
  if (!nameValidation.isValid) errors.name = nameValidation.message;
  
  const categoryValidation = validateCategory(item.category, categories);
  if (!categoryValidation.isValid) errors.category = categoryValidation.message;
  
  const quantityValidation = validateQuantity(item.quantity);
  if (!quantityValidation.isValid) errors.quantity = quantityValidation.message;
  
  const unitValidation = validateUnit(item.unit, units);
  if (!unitValidation.isValid) errors.unit = unitValidation.message;
  
  const minStockValidation = validateMinStockLevel(item.minStockLevel, item.quantity);
  if (!minStockValidation.isValid) errors.minStockLevel = minStockValidation.message;
  
  const expiryValidation = validateExpiryDate(item.expiryDate);
  if (!expiryValidation.isValid) errors.expiryDate = expiryValidation.message;
  
  const priceValidation = validatePrice(item.price);
  if (!priceValidation.isValid) errors.price = priceValidation.message;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warning: minStockValidation.warning,
  };
};

// Complete user registration validation
export const validateRegistration = (userData) => {
  const errors = {};
  
  const nameValidation = validateName(userData.name);
  if (!nameValidation.isValid) errors.name = nameValidation.message;
  
  const emailValidation = validateEmail(userData.email);
  if (!emailValidation.isValid) errors.email = emailValidation.message;
  
  const passwordValidation = validatePassword(userData.password);
  if (!passwordValidation.isValid) errors.password = passwordValidation.message;
  
  const confirmValidation = validateConfirmPassword(userData.password, userData.confirmPassword);
  if (!confirmValidation.isValid) errors.confirmPassword = confirmValidation.message;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Complete user login validation
export const validateLogin = (loginData) => {
  const errors = {};
  
  const emailValidation = validateEmail(loginData.email);
  if (!emailValidation.isValid) errors.email = emailValidation.message;
  
  const passwordValidation = validatePassword(loginData.password);
  if (!passwordValidation.isValid) errors.password = passwordValidation.message;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};