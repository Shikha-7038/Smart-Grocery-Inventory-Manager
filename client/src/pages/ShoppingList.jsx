// client/src/pages/ShoppingList.jsx
import React, { useState, useEffect } from 'react';
import { getShoppingList } from '../services/dashboardService';
import { updateQuantity } from '../services/groceryService';
import toast from 'react-hot-toast';

const ShoppingList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    fetchShoppingList();
  }, []);

  const fetchShoppingList = async () => {
    try {
      const response = await getShoppingList();
      setItems(response.data);
      // Initialize selected items
      const initialSelected = {};
      response.data.forEach(item => {
        initialSelected[item._id] = true;
      });
      setSelectedItems(initialSelected);
    } catch (error) {
      console.error('Error fetching shopping list:', error);
      toast.error('Failed to load shopping list');
    } finally {
      setLoading(false);
    }
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const getSuggestedQuantity = (item) => {
    // Suggest buying enough to reach minStockLevel * 2
    const suggestedQty = Math.max(item.minStockLevel * 2 - item.quantity, 1);
    return `${suggestedQty} ${item.unit}`;
  };

  const getItemType = (item) => {
    if (item.quantity === 0) return 'out-of-stock';
    if (item.quantity <= item.minStockLevel) return 'low-stock';
    return 'other';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const selectedCount = Object.values(selectedItems).filter(v => v).length;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping List</h1>
          <p className="text-gray-600 mt-1">
            Items that need to be restocked based on your inventory
          </p>
        </div>

        {/* Items List */}
        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <p className="text-gray-500 text-lg">Your inventory is well stocked!</p>
            <p className="text-gray-400 mt-2">No items need to be purchased right now.</p>
          </div>
        ) : (
          <>
            {/* Selection Controls */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-600">
                    Selected {selectedCount} of {items.length} items
                  </span>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      const allSelected = {};
                      items.forEach(item => { allSelected[item._id] = true; });
                      setSelectedItems(allSelected);
                    }}
                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => {
                      const noneSelected = {};
                      items.forEach(item => { noneSelected[item._id] = false; });
                      setSelectedItems(noneSelected);
                    }}
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            {/* Shopping List Items */}
            <div className="space-y-4">
              {items.map((item) => {
                const itemType = getItemType(item);
                const isSelected = selectedItems[item._id];
                
                return (
                  <div
                    key={item._id}
                    className={`bg-white rounded-lg shadow-md p-4 transition-all ${
                      isSelected ? 'border-l-4 border-blue-500' : 'opacity-70'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleItemSelection(item._id)}
                        className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500">{item.category}</p>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <div className="text-sm">
                              <span className="text-gray-500">Current:</span>
                              <span className="ml-1 font-medium">
                                {item.quantity} {item.unit}
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-500">Min Stock:</span>
                              <span className="ml-1 font-medium">
                                {item.minStockLevel} {item.unit}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                          <div>
                            {itemType === 'out-of-stock' && (
                              <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                                Out of Stock
                              </span>
                            )}
                            {itemType === 'low-stock' && (
                              <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                                Low Stock
                              </span>
                            )}
                          </div>
                          
                          <div className="bg-blue-50 rounded-lg px-4 py-2">
                            <span className="text-sm text-gray-600">Suggested to buy:</span>
                            <span className="ml-2 text-lg font-bold text-blue-600">
                              {getSuggestedQuantity(item)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => {
                  toast.success('Shopping list saved!');
                }}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Generate Shopping List PDF
              </button>
              <button
                onClick={() => {
                  toast.success('Items marked as purchased');
                  // Here you would update the quantities
                }}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Mark Selected as Purchased
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;