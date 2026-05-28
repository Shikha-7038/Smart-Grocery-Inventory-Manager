// client/src/components/Grocery/GroceryList.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GroceryCard from './GroceryCard';

const GroceryList = ({ items, onEdit, onDelete, onQuantityUpdate, loading = false }) => {
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const getFilteredItems = () => {
    let filtered = [...items];
    
    switch (filter) {
      case 'low-stock':
        filtered = filtered.filter(item => item.quantity <= item.minStockLevel && item.quantity > 0);
        break;
      case 'out-of-stock':
        filtered = filtered.filter(item => item.quantity === 0);
        break;
      case 'in-stock':
        filtered = filtered.filter(item => item.quantity > item.minStockLevel);
        break;
      case 'expiring-soon':
        filtered = filtered.filter(item => {
          if (!item.expiryDate) return false;
          const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
          return daysUntilExpiry <= 3 && daysUntilExpiry >= 0;
        });
        break;
      default:
        break;
    }
    
    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'quantity':
          return a.quantity - b.quantity;
        case 'expiry':
          if (!a.expiryDate) return 1;
          if (!b.expiryDate) return -1;
          return new Date(a.expiryDate) - new Date(b.expiryDate);
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const filteredItems = getFilteredItems();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <p className="text-gray-500 text-lg">No items found</p>
        <Link to="/groceries" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
          Add your first item →
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('low-stock')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              filter === 'low-stock' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Low Stock
          </button>
          <button
            onClick={() => setFilter('out-of-stock')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              filter === 'out-of-stock' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Out of Stock
          </button>
          <button
            onClick={() => setFilter('expiring-soon')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              filter === 'expiring-soon' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Expiring Soon
          </button>
        </div>

        <div className="flex space-x-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="quantity">Sort by Quantity</option>
            <option value="expiry">Sort by Expiry</option>
          </select>

          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-sm ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
              }`}
            >
              📱 Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
              }`}
            >
              📋 List
            </button>
          </div>
        </div>
      </div>

      {/* Items Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <GroceryCard
              key={item._id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
              onQuantityUpdate={onQuantityUpdate}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map(item => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    {item.notes && <div className="text-xs text-gray-500">{item.notes}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{item.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{item.quantity} {item.unit}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.quantity === 0 ? (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">Out of Stock</span>
                    ) : item.quantity <= item.minStockLevel ? (
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">Low Stock</span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">In Stock</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onQuantityUpdate(item._id, item.quantity, -1)}
                        className="text-red-600 hover:text-red-800"
                        disabled={item.quantity === 0}
                      >
                        -1
                      </button>
                      <button
                        onClick={() => onQuantityUpdate(item._id, item.quantity, 1)}
                        className="text-green-600 hover:text-green-800"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => onEdit(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(item._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GroceryList;