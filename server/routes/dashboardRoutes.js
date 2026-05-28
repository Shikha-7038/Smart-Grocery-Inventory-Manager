// server/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getRecentItems,
  getCategoryBreakdown,
  getShoppingList,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/recent', getRecentItems);
router.get('/categories', getCategoryBreakdown);
router.get('/shopping-list', getShoppingList);

module.exports = router;