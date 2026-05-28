// client/src/utils/helpers.js

// Format currency
export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date
export const formatDate = (date, format = 'MMM DD, YYYY') => {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  return d.toLocaleDateString('en-US', options);
};

// Format relative time
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  const now = new Date();
  const diffSeconds = Math.floor((now - d) / 1000);
  
  if (diffSeconds < 60) return 'just now';
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} minutes ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hours ago`;
  if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)} days ago`;
  return formatDate(date);
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Debounce function
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Calculate days between dates
export const daysBetween = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Check if date is expired
export const isExpired = (expiryDate) => {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
};

// Check if date is expiring soon
export const isExpiringSoon = (expiryDate, daysThreshold = 3) => {
  if (!expiryDate) return false;
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysUntil = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  return daysUntil <= daysThreshold && daysUntil >= 0;
};

// Get stock status
export const getStockStatus = (quantity, minStockLevel) => {
  if (quantity === 0) return 'out-of-stock';
  if (quantity <= minStockLevel) return 'low-stock';
  return 'in-stock';
};

// Get stock status color
export const getStockStatusColor = (status) => {
  const colors = {
    'in-stock': 'text-green-600 bg-green-100',
    'low-stock': 'text-yellow-600 bg-yellow-100',
    'out-of-stock': 'text-red-600 bg-red-100',
  };
  return colors[status] || colors['in-stock'];
};

// Validate email
export const isValidEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

// Validate password strength
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: 'Very Weak', color: 'red' };
  
  let score = 0;
  if (password.length >= 8) score++;
  if (password.match(/[a-z]+/)) score++;
  if (password.match(/[A-Z]+/)) score++;
  if (password.match(/[0-9]+/)) score++;
  if (password.match(/[$@#&!]+/)) score++;
  
  const strengths = [
    { score: 0, label: 'Very Weak', color: 'red' },
    { score: 1, label: 'Weak', color: 'orange' },
    { score: 2, label: 'Fair', color: 'yellow' },
    { score: 3, label: 'Good', color: 'blue' },
    { score: 4, label: 'Strong', color: 'green' },
    { score: 5, label: 'Very Strong', color: 'green' },
  ];
  
  return strengths[score] || strengths[0];
};

// Group array by key
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) result[groupKey] = [];
    result[groupKey].push(item);
    return result;
  }, {});
};

// Download JSON as file
export const downloadJSON = (data, filename) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};