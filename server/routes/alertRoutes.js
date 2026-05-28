// server/routes/alertRoutes.js
const express = require('express');
const router = express.Router();
const {
  getLowStockAlerts,
  getExpiryAlerts,
  getAllAlerts,
} = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.get('/low-stock', getLowStockAlerts);
router.get('/expiry', getExpiryAlerts);
router.get('/all', getAllAlerts);

module.exports = router;