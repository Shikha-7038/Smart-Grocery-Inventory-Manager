// server/controllers/alertController.js
const alertUtils = require('../utils/alertUtils');

// @desc    Get low stock alerts
// @route   GET /api/alerts/low-stock
// @access  Private
const getLowStockAlerts = async (req, res) => {
  try {
    const alerts = await alertUtils.getLowStockItems(req.user._id);
    
    res.status(200).json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get expiry alerts
// @route   GET /api/alerts/expiry
// @access  Private
const getExpiryAlerts = async (req, res) => {
  try {
    const days = req.query.days ? parseInt(req.query.days) : 3;
    const alerts = await alertUtils.getExpiringItems(req.user._id, days);
    
    res.status(200).json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get all alerts combined
// @route   GET /api/alerts/all
// @access  Private
const getAllAlerts = async (req, res) => {
  try {
    const lowStockAlerts = await alertUtils.getLowStockItems(req.user._id);
    const expiryAlerts = await alertUtils.getExpiringItems(req.user._id);
    
    res.status(200).json({
      success: true,
      data: {
        lowStock: lowStockAlerts,
        expiry: expiryAlerts,
        totalAlerts: lowStockAlerts.totalLowStock + expiryAlerts.totalExpiringSoon,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = {
  getLowStockAlerts,
  getExpiryAlerts,
  getAllAlerts,
};