// client/src/utils/constants.js

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },
  GROCERY: {
    BASE: '/grocery',
    UPDATE_QUANTITY: (id) => `/grocery/${id}/quantity`,
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT: '/dashboard/recent',
    CATEGORIES: '/dashboard/categories',
    SHOPPING_LIST: '/dashboard/shopping-list',
  },
  ALERTS: {
    LOW_STOCK: '/alerts/low-stock',
    EXPIRY: '/alerts/expiry',
    ALL: '/alerts/all',
  },
};

// Categories
export const CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Dairy',
  'Meat & Seafood',
  'Grains & Rice',
  'Spices & Condiments',
  'Beverages',
  'Snacks',
  'Frozen Foods',
  'Household',
  'Personal Care',
  'Other',
];

// Units
export const UNITS = ['pcs', 'kg', 'g', 'L', 'ml', 'pack', 'bottle', 'dozen'];

// Alert Thresholds
export const ALERT_THRESHOLDS = {
  EXPIRY_DAYS: 3,
  LOW_STOCK_MULTIPLIER: 1,
  AUTO_REFRESH_INTERVAL: 30000,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [5, 10, 20, 50, 100],
};

// Sort Options
export const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'quantity', label: 'Quantity (Low to High)' },
  { value: 'expiry', label: 'Expiry Date' },
  { value: 'price', label: 'Price (Low to High)' },
];

// Stock Status
export const STOCK_STATUS = {
  IN_STOCK: 'in-stock',
  LOW_STOCK: 'low-stock',
  OUT_OF_STOCK: 'out-of-stock',
};

// Stock Status Config
export const STOCK_STATUS_CONFIG = {
  [STOCK_STATUS.IN_STOCK]: { text: 'In Stock', color: 'green', icon: '🟢' },
  [STOCK_STATUS.LOW_STOCK]: { text: 'Low Stock', color: 'yellow', icon: '🟡' },
  [STOCK_STATUS.OUT_OF_STOCK]: { text: 'Out of Stock', color: 'red', icon: '🔴' },
};

// Toast Messages
export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGIN_ERROR: 'Login failed. Please check your credentials.',
  REGISTER_SUCCESS: 'Registration successful!',
  REGISTER_ERROR: 'Registration failed. Please try again.',
  ITEM_ADDED: 'Item added successfully!',
  ITEM_UPDATED: 'Item updated successfully!',
  ITEM_DELETED: 'Item deleted successfully!',
  QUANTITY_UPDATED: 'Quantity updated!',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  GROCERIES: '/groceries',
  INVENTORY: '/inventory',
  SHOPPING_LIST: '/shopping-list',
  PROFILE: '/profile',
};

// Theme Options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  API: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
  FULL: 'MMMM DD, YYYY HH:mm:ss',
};