// client/src/components/Grocery/GroceryFilters.jsx
import React from 'react';

const categories = [
  'All', 'Vegetables', 'Fruits', 'Dairy', 'Meat & Seafood', 
  'Grains & Rice', 'Spices & Condiments', 'Beverages', 
  'Snacks', 'Frozen Foods', 'Household', 'Personal Care', 'Other'
];

const sortOptions = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'quantity', label: 'Quantity (Low to High)' },
  { value: 'expiry', label: 'Expiry Date' },
  { value: 'price', label: 'Price (Low to High)' },
];

const GroceryFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-900">Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Search items..."
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={filters.category || 'All'}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            value={filters.sort || 'recent'}
            onChange={(e) => handleChange('sort', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Stock Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock Status
          </label>
          <select
            value={filters.stockStatus || 'all'}
            onChange={(e) => handleChange('stockStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Items</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.search || (filters.category && filters.category !== 'All') || 
        (filters.stockStatus && filters.stockStatus !== 'all')) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.search && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
              Search: {filters.search}
              <button
                onClick={() => handleChange('search', '')}
                className="ml-1 hover:text-blue-600"
              >
                ×
              </button>
            </span>
          )}
          {filters.category && filters.category !== 'All' && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
              Category: {filters.category}
              <button
                onClick={() => handleChange('category', 'All')}
                className="ml-1 hover:text-blue-600"
              >
                ×
              </button>
            </span>
          )}
          {filters.stockStatus && filters.stockStatus !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
              Status: {filters.stockStatus.replace('-', ' ')}
              <button
                onClick={() => handleChange('stockStatus', 'all')}
                className="ml-1 hover:text-blue-600"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default GroceryFilters;