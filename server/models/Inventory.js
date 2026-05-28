// server/models/Inventory.js
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    groceryItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GroceryItem',
      required: true,
    },
    batchNumber: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Please add quantity'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    unit: {
      type: String,
      required: [true, 'Please add unit'],
      enum: ['pcs', 'kg', 'g', 'L', 'ml', 'pack', 'bottle', 'dozen'],
      default: 'pcs',
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: false,
    },
    purchasePrice: {
      type: Number,
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
    store: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    consumedQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot be more than 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
inventorySchema.index({ user: 1, groceryItem: 1 });
inventorySchema.index({ expiryDate: 1 });
inventorySchema.index({ isActive: 1 });
inventorySchema.index({ purchaseDate: -1 });

// Virtual for available quantity
inventorySchema.virtual('availableQuantity').get(function() {
  return this.quantity - this.consumedQuantity;
});

// Method to check if expired
inventorySchema.methods.isExpired = function() {
  if (!this.expiryDate) return false;
  return new Date(this.expiryDate) < new Date();
};

// Method to check if expiring soon
inventorySchema.methods.isExpiringSoon = function(daysThreshold = 3) {
  if (!this.expiryDate) return false;
  const today = new Date();
  const expiryDate = new Date(this.expiryDate);
  const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
  return daysUntilExpiry <= daysThreshold && daysUntilExpiry >= 0;
};

// Static method to get total inventory value
inventorySchema.statics.getTotalInventoryValue = async function(userId) {
  const result = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId), isActive: true } },
    { 
      $group: { 
        _id: null, 
        total: { $sum: { $multiply: ['$availableQuantity', '$purchasePrice'] } }
      } 
    }
  ]);
  return result[0]?.total || 0;
};

// Static method to get low stock items
inventorySchema.statics.getLowStockItems = async function(userId, threshold = 5) {
  return await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId), isActive: true } },
    { 
      $project: {
        groceryItem: 1,
        availableQuantity: { $subtract: ['$quantity', '$consumedQuantity'] },
        unit: 1,
        expiryDate: 1,
      }
    },
    { $match: { availableQuantity: { $lt: threshold } } },
    { $lookup: {
        from: 'groceryitems',
        localField: 'groceryItem',
        foreignField: '_id',
        as: 'itemDetails'
      }
    },
    { $unwind: '$itemDetails' },
  ]);
};

module.exports = mongoose.model('Inventory', inventorySchema);