// server/config/constants.js

// Category constants
const CATEGORIES = {
  VEGETABLES: 'Vegetables',
  FRUITS: 'Fruits',
  DAIRY: 'Dairy',
  MEAT_SEAFOOD: 'Meat & Seafood',
  GRAINS_RICE: 'Grains & Rice',
  SPICES_CONDIMENTS: 'Spices & Condiments',
  BEVERAGES: 'Beverages',
  SNACKS: 'Snacks',
  FROZEN_FOODS: 'Frozen Foods',
  HOUSEHOLD: 'Household',
  PERSONAL_CARE: 'Personal Care',
  OTHER: 'Other'
};

const CATEGORIES_LIST = Object.values(CATEGORIES);

// Unit constants
const UNITS = {
  PIECES: 'pcs',
  KILOGRAM: 'kg',
  GRAM: 'g',
  LITER: 'L',
  MILLILITER: 'ml',
  PACK: 'pack',
  BOTTLE: 'bottle',
  DOZEN: 'dozen'
};

const UNITS_LIST = Object.values(UNITS);

// Alert thresholds
const ALERT_CONFIG = {
  EXPIRY_DAYS_THRESHOLD: 3, // Days before expiry to show alert
  LOW_STOCK_THRESHOLD_MULTIPLIER: 1, // multiplier for minStockLevel
  AUTO_REFRESH_INTERVAL: 30000, // 30 seconds
};

// Pagination defaults
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// User roles
const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// HTTP Status codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// Response messages
const RESPONSE_MESSAGES = {
  // Success messages
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'User registered successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  ITEM_CREATED: 'Grocery item added successfully',
  ITEM_UPDATED: 'Item updated successfully',
  ITEM_DELETED: 'Item deleted successfully',
  QUANTITY_UPDATED: 'Quantity updated successfully',
  
  // Error messages
  USER_EXISTS: 'User already exists with this email',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  ITEM_NOT_FOUND: 'Item not found',
  UNAUTHORIZED: 'Not authorized',
  TOKEN_FAILED: 'Not authorized, token failed',
  NO_TOKEN: 'Not authorized, no token',
  SERVER_ERROR: 'Server error',
  VALIDATION_ERROR: 'Validation error',
  
  // Alert messages
  LOW_STOCK_ALERT: 'Item is low in stock',
  OUT_OF_STOCK_ALERT: 'Item is out of stock',
  EXPIRY_SOON_ALERT: 'Item will expire soon',
  EXPIRED_ALERT: 'Item has expired',
};

// Validation patterns
const VALIDATION_PATTERNS = {
  EMAIL: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
  NAME: /^[a-zA-Z\s]{2,50}$/,
};

// Sort options
const SORT_OPTIONS = {
  RECENT: 'recent',
  NAME: 'name',
  QUANTITY: 'quantity',
  EXPIRY: 'expiry',
  PRICE: 'price',
  CATEGORY: 'category',
};

const SORT_FIELDS = {
  [SORT_OPTIONS.RECENT]: { createdAt: -1 },
  [SORT_OPTIONS.NAME]: { name: 1 },
  [SORT_OPTIONS.QUANTITY]: { quantity: 1 },
  [SORT_OPTIONS.EXPIRY]: { expiryDate: 1 },
  [SORT_OPTIONS.PRICE]: { price: 1 },
  [SORT_OPTIONS.CATEGORY]: { category: 1 },
};

// Filter options
const FILTER_OPTIONS = {
  ALL: 'All',
  LOW_STOCK: 'Low Stock',
  OUT_OF_STOCK: 'Out of Stock',
  EXPIRING_SOON: 'Expiring Soon',
  EXPIRED: 'Expired',
};

module.exports = {
  CATEGORIES,
  CATEGORIES_LIST,
  UNITS,
  UNITS_LIST,
  ALERT_CONFIG,
  PAGINATION,
  USER_ROLES,
  HTTP_STATUS,
  RESPONSE_MESSAGES,
  VALIDATION_PATTERNS,
  SORT_OPTIONS,
  SORT_FIELDS,
  FILTER_OPTIONS,
};