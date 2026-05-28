// client/src/components/Inventory/ShoppingList.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ShoppingList = ({ items, onGeneratePDF, onMarkPurchased, loading = false }) => {
  const [selectedItems, setSelectedItems] = useState({});
  const [showShareOptions, setShowShareOptions] = useState(false);

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const selectAll = () => {
    const newSelected = {};
    items.forEach(item => {
      newSelected[item._id] = true;
    });
    setSelectedItems(newSelected);
  };

  const clearSelection = () => {
    setSelectedItems({});
  };

  const getSuggestedQuantity = (item) => {
    const needed = Math.max(item.minStockLevel * 2 - item.quantity, 1);
    return `${needed} ${item.unit}`;
  };

  const selectedCount = Object.values(selectedItems).filter(v => v).length;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Shopping List is Empty</h3>
        <p className="text-gray-500 mb-4">Your inventory is well stocked! No items need to be purchased.</p>
        <Link to="/groceries" className="text-blue-600 hover:text-blue-800">
          Add some items to your inventory →
        </Link>
      </div>
    );
  }

  // Group items by category
  const groupedItems = items.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) groups[category] = [];
    groups[category].push(item);
    return groups;
  }, {});

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex space-x-2">
            <button
              onClick={selectAll}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
            >
              Select All
            </button>
            <button
              onClick={clearSelection}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
            >
              Clear
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowShareOptions(!showShareOptions)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
            >
              Share 📤
            </button>
            <button
              onClick={onGeneratePDF}
              className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded hover:bg-green-200"
            >
              Download PDF 📄
            </button>
            {selectedCount > 0 && (
              <button
                onClick={() => onMarkPurchased(Object.keys(selectedItems).filter(id => selectedItems[id]))}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Mark Purchased ({selectedCount})
              </button>
            )}
          </div>
        </div>

        {showShareOptions && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Share via:</p>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded">
                WhatsApp
              </button>
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded">
                Copy Link
              </button>
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded">
                Email
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Shopping List Items Grouped by Category */}
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <h3 className="font-semibold text-gray-900">{category}</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {categoryItems.map((item) => {
              const isSelected = selectedItems[item._id];
              const isOutOfStock = item.quantity === 0;
              
              return (
                <div
                  key={item._id}
                  className={`p-4 transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleItemSelection(item._id)}
                      className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          {item.notes && (
                            <p className="text-xs text-gray-500 mt-1">{item.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            {getSuggestedQuantity(item)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Current: {item.quantity} {item.unit}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex flex-wrap gap-2">
                        {isOutOfStock ? (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                            Out of Stock - Urgent
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                            Low Stock - Restock Soon
                          </span>
                        )}
                        {item.minStockLevel > 0 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            Min Stock: {item.minStockLevel} {item.unit}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{items.length}</p>
            <p className="text-xs text-gray-500">Total Items to Buy</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">
              {items.filter(i => i.quantity > 0 && i.quantity <= i.minStockLevel).length}
            </p>
            <p className="text-xs text-gray-500">Low Stock</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">
              {items.filter(i => i.quantity === 0).length}
            </p>
            <p className="text-xs text-gray-500">Out of Stock</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{Object.keys(groupedItems).length}</p>
            <p className="text-xs text-gray-500">Categories</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;