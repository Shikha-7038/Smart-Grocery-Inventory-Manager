// client/src/components/Alerts/LowStockAlert.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLowStockAlerts } from '../../services/alertService';
import toast from 'react-hot-toast';

const LowStockAlert = ({ autoRefresh = true, refreshInterval = 30000 }) => {
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    fetchAlerts();
    
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchAlerts, refreshInterval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval]);

  const fetchAlerts = async () => {
    try {
      const response = await getLowStockAlerts();
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching low stock alerts:', error);
      toast.error('Failed to load low stock alerts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const totalAlerts = (alerts?.totalLowStock || 0) + (alerts?.totalOutOfStock || 0);
  
  if (totalAlerts === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="text-green-800 font-medium">All items are well stocked!</p>
            <p className="text-green-600 text-sm">No low stock alerts at this time.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex justify-between items-center p-4 bg-red-50 hover:bg-red-100 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-red-800">Low Stock Alerts</h3>
            <p className="text-sm text-red-600">
              {alerts?.totalLowStock} low stock • {alerts?.totalOutOfStock} out of stock
            </p>
          </div>
        </div>
        <span className="text-red-600">{expanded ? '▼' : '▶'}</span>
      </button>

      {/* Content */}
      {expanded && (
        <div className="p-4 space-y-4">
          {/* Out of Stock Items */}
          {alerts?.outOfStock?.length > 0 && (
            <div>
              <h4 className="font-medium text-red-700 mb-2 flex items-center">
                <span className="mr-2">🔴</span> Out of Stock
              </h4>
              <div className="space-y-2">
                {alerts.outOfStock.map((item) => (
                  <div key={item._id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-red-600 font-medium">Need to buy</p>
                      <p className="text-xs text-gray-500">Min: {item.minStockLevel} {item.unit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Low Stock Items */}
          {alerts?.lowStock?.length > 0 && (
            <div>
              <h4 className="font-medium text-yellow-700 mb-2 flex items-center">
                <span className="mr-2">🟡</span> Low Stock
              </h4>
              <div className="space-y-2">
                {alerts.lowStock.map((item) => (
                  <div key={item._id} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Current: {item.quantity} {item.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-yellow-600 font-medium">
                        {Math.round((item.quantity / item.minStockLevel) * 100)}% remaining
                      </p>
                      <p className="text-xs text-gray-500">
                        Min: {item.minStockLevel} {item.unit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <Link
              to="/shopping-list"
              className="flex-1 text-center bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Generate Shopping List
            </Link>
            <Link
              to="/inventory"
              className="flex-1 text-center border border-red-600 text-red-600 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              Update Inventory
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default LowStockAlert;