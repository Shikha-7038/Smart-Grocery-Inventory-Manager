// client/src/components/Grocery/GroceryCard.jsx
import React from 'react';

const GroceryCard = ({ item, onEdit, onDelete, onQuantityUpdate }) => {
  const getStockStatus = () => {
    if (item.quantity === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: '🔴' };
    if (item.quantity <= item.minStockLevel) return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', icon: '🟡' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-800', icon: '🟢' };
  };

  const getExpiryStatus = () => {
    if (!item.expiryDate) return null;
    
    const today = new Date();
    const expiryDate = new Date(item.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { text: 'Expired', color: 'text-red-600', icon: '💀' };
    if (daysUntilExpiry === 0) return { text: 'Expires Today', color: 'text-red-600', icon: '⚠️' };
    if (daysUntilExpiry <= 3) return { text: `${daysUntilExpiry} days left`, color: 'text-orange-600', icon: '⏰' };
    return null;
  };

  const stockStatus = getStockStatus();
  const expiryStatus = getExpiryStatus();
  const stockPercentage = Math.min(100, Math.round((item.quantity / item.minStockLevel) * 100));

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.category}</p>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
            {stockStatus.icon} {stockStatus.text}
          </span>
        </div>

        {/* Quantity Section */}
        <div className="mt-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Stock Level</span>
            <span className="font-medium">{item.quantity} / {item.minStockLevel} {item.unit}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                item.quantity === 0 ? 'bg-red-500' :
                item.quantity <= item.minStockLevel ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${stockPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Expiry Info */}
        {expiryStatus && (
          <div className="mt-2 flex items-center space-x-1 text-sm">
            <span>{expiryStatus.icon}</span>
            <span className={expiryStatus.color}>{expiryStatus.text}</span>
            <span className="text-gray-400 text-xs">
              ({new Date(item.expiryDate).toLocaleDateString()})
            </span>
          </div>
        )}

        {/* Price and Barcode */}
        <div className="mt-3 flex justify-between text-sm">
          {item.price > 0 && (
            <div>
              <span className="text-gray-500">Price:</span>
              <span className="ml-1 font-medium">₹{item.price}</span>
            </div>
          )}
          {item.barcode && (
            <div>
              <span className="text-gray-500">Barcode:</span>
              <span className="ml-1 font-mono text-xs">{item.barcode}</span>
            </div>
          )}
        </div>

        {/* Notes */}
        {item.notes && (
          <p className="mt-2 text-xs text-gray-500 border-t border-gray-100 pt-2">{item.notes}</p>
        )}

        {/* Actions */}
        <div className="mt-4 flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={() => onQuantityUpdate(item._id, item.quantity, -1)}
              disabled={item.quantity === 0}
              className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              -1
            </button>
            <button
              onClick={() => onQuantityUpdate(item._id, item.quantity, 1)}
              className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors"
            >
              +1
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(item)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(item._id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroceryCard;