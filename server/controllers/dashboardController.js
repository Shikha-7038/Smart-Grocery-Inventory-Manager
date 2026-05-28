// server/controllers/dashboardController.js
const GroceryItem = require('../models/GroceryItem');
const alertUtils = require('../utils/alertUtils');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const stats = await alertUtils.getDashboardStats(req.user._id);
    
    res.status(200).json({
      success: true,
      data: stats,
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

// @desc    Get recent items
// @route   GET /api/dashboard/recent
// @access  Private
const getRecentItems = async (req, res) => {
  try {
    const recentItems = await GroceryItem.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.status(200).json({
      success: true,
      data: recentItems,
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

// @desc    Get category breakdown
// @route   GET /api/dashboard/categories
// @access  Private
const getCategoryBreakdown = async (req, res) => {
  try {
    const categories = await GroceryItem.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$category', count: { $sum: 1 }, totalQuantity: { $sum: '$quantity' } } },
      { $sort: { count: -1 } },
    ]);
    
    res.status(200).json({
      success: true,
      data: categories,
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

// @desc    Get shopping list (low stock + out of stock)
// @route   GET /api/dashboard/shopping-list
// @access  Private
const getShoppingList = async (req, res) => {
  try {
    const { lowStock, outOfStock } = await alertUtils.getLowStockItems(req.user._id);
    
    const shoppingList = [...lowStock, ...outOfStock];
    
    res.status(200).json({
      success: true,
      data: shoppingList,
      summary: {
        total: shoppingList.length,
        lowStock: lowStock.length,
        outOfStock: outOfStock.length,
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
  getDashboardStats,
  getRecentItems,
  getCategoryBreakdown,
  getShoppingList,
};