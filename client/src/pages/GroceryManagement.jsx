// client/src/pages/GroceryManagement.jsx
import React, { useState, useEffect } from 'react';
import { getGroceryItems, createGroceryItem, updateGroceryItem, deleteGroceryItem } from '../services/groceryService';
import toast from 'react-hot-toast';

const categories = [
  'Vegetables', 'Fruits', 'Dairy', 'Meat & Seafood', 
  'Grains & Rice', 'Spices & Condiments', 'Beverages', 
  'Snacks', 'Frozen Foods', 'Household', 'Personal Care', 'Other'
];

const units = ['pcs', 'kg', 'g', 'L', 'ml', 'pack', 'bottle', 'dozen'];

const GroceryManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filters, setFilters] = useState({ category: 'All', search: '', sort: 'recent' });
  const [formData, setFormData] = useState({
    name: '',
    category: 'Other',
    quantity: 0,
    unit: 'pcs',
    minStockLevel: 1,
    expiryDate: '',
    price: 0,
    notes: '',
  });

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await getGroceryItems(filters);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateGroceryItem(editingItem._id, formData);
        toast.success('Item updated successfully');
      } else {
        await createGroceryItem(formData);
        toast.success('Item added successfully');
      }
      resetForm();
      fetchItems();
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Failed to save item');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteGroceryItem(id);
        toast.success('Item deleted successfully');
        fetchItems();
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Failed to delete item');
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      minStockLevel: item.minStockLevel,
      expiryDate: item.expiryDate ? item.expiryDate.split('T')[0] : '',
      price: item.price,
      notes: item.notes || '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setShowForm(false);
    setFormData({
      name: '',
      category: 'Other',
      quantity: 0,
      unit: 'pcs',
      minStockLevel: 1,
      expiryDate: '',
      price: 0,
      notes: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Grocery Management</h1>
            <p className="text-gray-600 mt-1">Add, edit, and manage your grocery items</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Cancel' : '+ Add New Item'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.5"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                <select
                  required
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stock Level *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.minStockLevel}
                  onChange={(e) => setFormData({ ...formData, minStockLevel: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingItem ? 'Update' : 'Add'} Item
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search items..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="recent">Most Recent</option>
                <option value="name">Name</option>
                <option value="quantity">Quantity (Low to High)</option>
                <option value="expiry">Expiry Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Items List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No items found</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Add your first item →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {items.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                      <div className="md:hidden flex space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Quantity:</span>
                        <span className="ml-2 font-medium">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Min Stock:</span>
                        <span className="ml-2 font-medium">
                          {item.minStockLevel} {item.unit}
                        </span>
                      </div>
                      {item.expiryDate && (
                        <div>
                          <span className="text-gray-500">Expires:</span>
                          <span className="ml-2 font-medium">
                            {new Date(item.expiryDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {item.price > 0 && (
                        <div>
                          <span className="text-gray-500">Price:</span>
                          <span className="ml-2 font-medium">₹{item.price}</span>
                        </div>
                      )}
                    </div>
                    
                    {item.notes && (
                      <p className="mt-2 text-sm text-gray-500">{item.notes}</p>
                    )}
                  </div>
                  
                  <div className="hidden md:flex items-center space-x-3 mt-4 md:mt-0">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                {/* Stock Status Indicator */}
                <div className="mt-3">
                  {item.quantity === 0 ? (
                    <div className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                      Out of Stock
                    </div>
                  ) : item.quantity <= item.minStockLevel ? (
                    <div className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                      Low Stock
                    </div>
                  ) : (
                    <div className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                      In Stock
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroceryManagement;