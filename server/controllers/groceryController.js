// server/controllers/groceryController.js
const GroceryItem = require('../models/GroceryItem');

// @desc    Create a grocery item
// @route   POST /api/grocery
// @access  Private
const createGroceryItem = async (req, res) => {
  try {
    const {
      name,
      category,
      quantity,
      unit,
      minStockLevel,
      expiryDate,
      price,
      barcode,
      notes,
    } = req.body;

    const groceryItem = await GroceryItem.create({
      user: req.user._id,
      name,
      category,
      quantity,
      unit,
      minStockLevel,
      expiryDate,
      price,
      barcode,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Grocery item added successfully',
      data: groceryItem,
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

// @desc    Get all grocery items for a user
// @route   GET /api/grocery
// @access  Private
const getGroceryItems = async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 10 } = req.query;
    
    let query = { user: req.user._id };
    
    // Apply category filter
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // Apply search filter
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    // Apply sorting
    let sortOption = {};
    if (sort === 'name') sortOption = { name: 1 };
    else if (sort === 'quantity') sortOption = { quantity: 1 };
    else if (sort === 'expiry') sortOption = { expiryDate: 1 };
    else if (sort === 'recent') sortOption = { createdAt: -1 };
    else sortOption = { createdAt: -1 };
    
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;
    
    const items = await GroceryItem.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);
    
    const total = await GroceryItem.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: items,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
        limit: pageSize,
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

// @desc    Get single grocery item
// @route   GET /api/grocery/:id
// @access  Private
const getGroceryItemById = async (req, res) => {
  try {
    const item = await GroceryItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }
    
    // Check if item belongs to user
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this item',
      });
    }
    
    res.status(200).json({
      success: true,
      data: item,
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

// @desc    Update grocery item
// @route   PUT /api/grocery/:id
// @access  Private
const updateGroceryItem = async (req, res) => {
  try {
    let item = await GroceryItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }
    
    // Check if item belongs to user
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this item',
      });
    }
    
    item = await GroceryItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: item,
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

// @desc    Delete grocery item
// @route   DELETE /api/grocery/:id
// @access  Private
const deleteGroceryItem = async (req, res) => {
  try {
    const item = await GroceryItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }
    
    // Check if item belongs to user
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this item',
      });
    }
    
    await item.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
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

// @desc    Update item quantity
// @route   PATCH /api/grocery/:id/quantity
// @access  Private
const updateQuantity = async (req, res) => {
  try {
    const { quantity, operation } = req.body;
    
    const item = await GroceryItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }
    
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }
    
    let newQuantity = item.quantity;
    
    if (operation === 'increment') {
      newQuantity += quantity;
    } else if (operation === 'decrement') {
      newQuantity -= quantity;
      if (newQuantity < 0) newQuantity = 0;
    } else {
      newQuantity = quantity;
    }
    
    item.quantity = newQuantity;
    await item.save();
    
    res.status(200).json({
      success: true,
      message: 'Quantity updated successfully',
      data: item,
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
  createGroceryItem,
  getGroceryItems,
  getGroceryItemById,
  updateGroceryItem,
  deleteGroceryItem,
  updateQuantity,
};