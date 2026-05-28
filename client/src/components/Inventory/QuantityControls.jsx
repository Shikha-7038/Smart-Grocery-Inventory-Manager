// client/src/components/Inventory/QuantityControls.jsx
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const QuantityControls = ({ item, onUpdate, compact = false }) => {
  const [customQuantity, setCustomQuantity] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleUpdate = (change) => {
    const newQuantity = item.quantity + change;
    if (newQuantity < 0) {
      toast.error('Quantity cannot be negative');
      return;
    }
    onUpdate(item._id, Math.abs(change), change > 0 ? 'increment' : 'decrement');
  };

  const handleCustomUpdate = () => {
    const qty = parseFloat(customQuantity);
    if (isNaN(qty) || qty <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    onUpdate(item._id, qty, 'set');
    setCustomQuantity('');
    setShowCustomInput(false);
    toast.success(`Updated ${item.name} to ${qty} ${item.unit}`);
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-1">
        <button
          onClick={() => handleUpdate(-1)}
          disabled={item.quantity === 0}
          className="w-7 h-7 flex items-center justify-center bg-red-100 text-red-600 rounded hover:bg-red-200 disabled:opacity-50"
        >
          -
        </button>
        <span className="text-sm font-medium min-w-[40px] text-center">
          {item.quantity}
        </span>
        <button
          onClick={() => handleUpdate(1)}
          className="w-7 h-7 flex items-center justify-center bg-green-100 text-green-600 rounded hover:bg-green-200"
        >
          +
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleUpdate(-1)}
          disabled={item.quantity === 0}
          className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 disabled:opacity-50 transition-colors"
        >
          -1
        </button>
        <button
          onClick={() => handleUpdate(-5)}
          disabled={item.quantity < 5}
          className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 disabled:opacity-50 transition-colors"
        >
          -5
        </button>
        <span className="text-lg font-semibold min-w-[60px] text-center">
          {item.quantity} {item.unit}
        </span>
        <button
          onClick={() => handleUpdate(1)}
          className="px-3 py-1 bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors"
        >
          +1
        </button>
        <button
          onClick={() => handleUpdate(5)}
          className="px-3 py-1 bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors"
        >
          +5
        </button>
        <button
          onClick={() => setShowCustomInput(!showCustomInput)}
          className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
        >
          Custom
        </button>
      </div>

      {showCustomInput && (
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={customQuantity}
            onChange={(e) => setCustomQuantity(e.target.value)}
            placeholder="Enter quantity"
            step="0.5"
            min="0"
            className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCustomUpdate}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Set
          </button>
          <button
            onClick={() => {
              setShowCustomInput(false);
              setCustomQuantity('');
            }}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default QuantityControls;