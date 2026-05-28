// client/src/pages/Inventory.jsx
import React, { useState, useEffect } from 'react';
import { getGroceryItems, updateQuantity } from '../services/groceryService';
import toast from 'react-hot-toast';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = [
    'All', 'Vegetables', 'Fruits', 'Dairy', 'Meat & Seafood', 
    'Grains & Rice', 'Spices & Condiments', 'Beverages', 
    'Snacks', 'Frozen Foods', 'Household', 'Personal Care', 'Other'
  ];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await getGroceryItems({ limit: 100 });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityUpdate = async (id, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 0) {
      toast.error('Quantity cannot be negative');
      return;
    }
    
    try {
      await updateQuantity(id, Math.abs(change), change > 0 ? 'increment' : 'decrement');
      toast.success('Quantity updated');
      fetchItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (item) => {
    if (item.quantity === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (item.quantity <= item.minStockLevel) return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Track and update your stock levels</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Items</label>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500">No items found in inventory</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item) => {
                    const stockStatus = getStockStatus(item);
                    const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
                    const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 3 && daysUntilExpiry >= 0;
                    const isExpired = daysUntilExpiry !== null && daysUntilExpiry < 0;
                    
                    return (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          {item.notes && <div className="text-xs text-gray-500">{item.notes}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">{item.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {item.quantity} {item.unit}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">
                            {item.minStockLevel} {item.unit}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stockStatus.color}`}>
                            {stockStatus.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.expiryDate ? (
                            <span className={`text-sm ${isExpired ? 'text-red-600 font-bold' : isExpiringSoon ? 'text-orange-600' : 'text-gray-600'}`}>
                              {new Date(item.expiryDate).toLocaleDateString()}
                              {isExpiringSoon && !isExpired && ` (${daysUntilExpiry} days left)`}
                              {isExpired && ' (Expired)'}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">No expiry</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleQuantityUpdate(item._id, item.quantity, -1)}
                              className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm"
                              disabled={item.quantity === 0}
                            >
                              -1
                            </button>
                            <button
                              onClick={() => handleQuantityUpdate(item._id, item.quantity, 1)}
                              className="px-2 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200 text-sm"
                            >
                              +1
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        {filteredItems.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-gray-500 text-sm">Total Items</p>
              <p className="text-2xl font-bold">{filteredItems.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-gray-500 text-sm">Low Stock Items</p>
              <p className="text-2xl font-bold text-yellow-600">
                {filteredItems.filter(i => i.quantity > 0 && i.quantity <= i.minStockLevel).length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-gray-500 text-sm">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">
                {filteredItems.filter(i => i.quantity === 0).length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-gray-500 text-sm">Expiring Soon (≤3 days)</p>
              <p className="text-2xl font-bold text-orange-600">
                {filteredItems.filter(i => {
                  const days = getDaysUntilExpiry(i.expiryDate);
                  return days !== null && days <= 3 && days >= 0;
                }).length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;