// client/src/components/Inventory/InventoryTable.jsx
import React, { useState } from 'react';

const InventoryTable = ({ items, onQuantityUpdate, onEdit, onDelete, loading = false }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => item._id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const getStockStatusBadge = (item) => {
    if (item.quantity === 0) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">Out of Stock</span>;
    }
    if (item.quantity <= item.minStockLevel) {
      return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">Low Stock</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">In Stock</span>;
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { text: 'No expiry', color: 'text-gray-400' };
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntil = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) return { text: 'Expired', color: 'text-red-600 font-bold' };
    if (daysUntil === 0) return { text: 'Today', color: 'text-red-600' };
    if (daysUntil <= 3) return { text: `${daysUntil} days left`, color: 'text-orange-600' };
    return { text: `${daysUntil} days left`, color: 'text-green-600' };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200"></div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-gray-100 border-t border-gray-200"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Stock</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => {
              const expiryStatus = getExpiryStatus(item.expiryDate);
              
              return (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => handleSelectItem(item._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    {item.notes && <div className="text-xs text-gray-500">{item.notes}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{item.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900">
                      {item.quantity} {item.unit}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">
                      {item.minStockLevel} {item.unit}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {getStockStatusBadge(item)}
                  </td>
                  <td className="px-4 py-3">
                    {item.expiryDate ? (
                      <div>
                        <span className={`text-sm ${expiryStatus.color}`}>
                          {expiryStatus.text}
                        </span>
                        <div className="text-xs text-gray-400">
                          {new Date(item.expiryDate).toLocaleDateString()}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Not set</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onQuantityUpdate(item._id, item.quantity, -1)}
                        disabled={item.quantity === 0}
                        className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 disabled:opacity-50"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => onQuantityUpdate(item._id, item.quantity, 1)}
                        className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded hover:bg-green-200"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => onEdit(item)}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(item._id)}
                        className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {selectedItems.length} item(s) selected
          </span>
          <div className="space-x-2">
            <button
              onClick={() => {
                selectedItems.forEach(id => onQuantityUpdate(id, 0, 'decrement', 1));
                setSelectedItems([]);
                setSelectAll(false);
              }}
              className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
            >
              Bulk Delete
            </button>
            <button
              className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
              onClick={() => {
                setSelectedItems([]);
                setSelectAll(false);
              }}
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;