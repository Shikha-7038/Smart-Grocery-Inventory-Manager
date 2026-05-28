// server/utils/alertUtils.js
const mongoose = require('mongoose');
const GroceryItem = require('../models/GroceryItem');

// Check for low stock items
const getLowStockItems = async (userId) => {
  try {
    const items = await GroceryItem.find({ user: userId });
    
    const lowStockItems = items.filter(
      (item) => item.quantity <= item.minStockLevel && item.quantity > 0
    );
    
    const outOfStockItems = items.filter(
      (item) => item.quantity === 0
    );
    
    return {
      lowStock: lowStockItems,
      outOfStock: outOfStockItems,
      totalLowStock: lowStockItems.length,
      totalOutOfStock: outOfStockItems.length,
    };
  } catch (error) {
    console.error('Error getting low stock items:', error);
    throw error;
  }
};

// Check for expiring items
const getExpiringItems = async (userId, daysThreshold = 3) => {
  try {
    const items = await GroceryItem.find({
      user: userId,
      expiryDate: { $exists: true, $ne: null },
    });
    
    const today = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + daysThreshold);
    
    const expiringSoon = items.filter((item) => {
      const expiryDate = new Date(item.expiryDate);
      return expiryDate <= thresholdDate && expiryDate > today;
    });
    
    const expiredItems = items.filter((item) => {
      const expiryDate = new Date(item.expiryDate);
      return expiryDate < today;
    });
    
    return {
      expiringSoon,
      expiredItems,
      totalExpiringSoon: expiringSoon.length,
      totalExpired: expiredItems.length,
    };
  } catch (error) {
    console.error('Error getting expiring items:', error);
    throw error;
  }
};

// Get dashboard statistics
const getDashboardStats = async (userId) => {
  try {
    const totalItems = await GroceryItem.countDocuments({ user: userId });
    const totalCategories = await GroceryItem.distinct('category', { user: userId });
    
    const lowStockData = await getLowStockItems(userId);
    const expiryData = await getExpiringItems(userId);
    
    // Get total value of inventory
    const itemsWithPrice = await GroceryItem.find({ 
      user: userId, 
      price: { $gt: 0 } 
    });
    const totalValue = itemsWithPrice.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
    
    // Get items by category - FIXED: Convert string to ObjectId properly
    const { Types } = mongoose;
    const itemsByCategory = await GroceryItem.aggregate([
      { $match: { user: new Types.ObjectId(userId) } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    
    return {
      totalItems,
      totalCategories: totalCategories.length,
      totalLowStock: lowStockData.totalLowStock,
      totalExpiringSoon: expiryData.totalExpiringSoon,
      totalValue: totalValue.toFixed(2),
      itemsByCategory,
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
};

module.exports = {
  getLowStockItems,
  getExpiringItems,
  getDashboardStats,
};