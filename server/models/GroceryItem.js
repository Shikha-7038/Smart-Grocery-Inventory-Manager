// server/models/GroceryItem.js
const mongoose = require('mongoose');

const groceryItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add item name'],
      trim: true,
      maxlength: [100, 'Item name cannot be more than 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
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
      ],
      default: 'Other',
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
    minStockLevel: {
      type: Number,
      required: [true, 'Please set minimum stock level'],
      min: [0, 'Minimum stock level cannot be negative'],
      default: 1,
    },
    expiryDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: 'Expiry date must be in the future',
      },
    },
    price: {
      type: Number,
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
    barcode: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot be more than 500 characters'],
    },
    image: {
      type: String,
      default: '',
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
groceryItemSchema.index({ user: 1, category: 1 });
groceryItemSchema.index({ expiryDate: 1 });
groceryItemSchema.index({ quantity: 1, minStockLevel: 1 });

module.exports = mongoose.model('GroceryItem', groceryItemSchema);