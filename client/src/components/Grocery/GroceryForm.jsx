// client/src/components/Grocery/GroceryForm.jsx
import React, { useState, useEffect } from 'react';

const categories = [
  'Vegetables', 'Fruits', 'Dairy', 'Meat & Seafood', 
  'Grains & Rice', 'Spices & Condiments', 'Beverages', 
  'Snacks', 'Frozen Foods', 'Household', 'Personal Care', 'Other'
];

const units = ['pcs', 'kg', 'g', 'L', 'ml', 'pack', 'bottle', 'dozen'];

const GroceryForm = ({ initialData, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Other',
    quantity: 0,
    unit: 'pcs',
    minStockLevel: 1,
    expiryDate: '',
    price: 0,
    barcode: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || 'Other',
        quantity: initialData.quantity || 0,
        unit: initialData.unit || 'pcs',
        minStockLevel: initialData.minStockLevel || 1,
        expiryDate: initialData.expiryDate ? initialData.expiryDate.split('T')[0] : '',
        price: initialData.price || 0,
        barcode: initialData.barcode || '',
        notes: initialData.notes || '',
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }
    
    if (formData.minStockLevel < 0) {
      newErrors.minStockLevel = 'Minimum stock level cannot be negative';
    }
    
    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }
    
    if (formData.expiryDate && new Date(formData.expiryDate) < new Date()) {
      newErrors.expiryDate = 'Expiry date must be in the future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Item Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Organic Apples"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Unit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unit *
          </label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {units.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity *
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            step="0.5"
            min="0"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.quantity ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.quantity && <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>}
        </div>

        {/* Minimum Stock Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Stock Level *
          </label>
          <input
            type="number"
            name="minStockLevel"
            value={formData.minStockLevel}
            onChange={handleChange}
            step="0.5"
            min="0"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.minStockLevel ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <p className="mt-1 text-xs text-gray-500">Alert when stock falls below this level</p>
          {errors.minStockLevel && <p className="mt-1 text-xs text-red-600">{errors.minStockLevel}</p>}
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date
          </label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.expiryDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.expiryDate && <p className="mt-1 text-xs text-red-600">{errors.expiryDate}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (₹)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
        </div>

        {/* Barcode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Barcode (Optional)
          </label>
          <input
            type="text"
            name="barcode"
            value={formData.barcode}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Scan or enter barcode"
          />
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Additional notes about this item..."
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : initialData ? 'Update Item' : 'Add Item'}
        </button>
      </div>
    </form>
  );
};

export default GroceryForm;