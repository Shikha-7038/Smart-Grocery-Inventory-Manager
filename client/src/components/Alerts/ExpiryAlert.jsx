// client/src/components/Alerts/ExpiryAlert.jsx
import React, { useState, useEffect } from 'react';
import { getExpiryAlerts } from '../../services/alertService';
import toast from 'react-hot-toast';

const ExpiryAlert = ({ daysThreshold = 3, autoRefresh = true, refreshInterval = 30000 }) => {
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [threshold, setThreshold] = useState(daysThreshold);

  useEffect(() => {
    fetchAlerts();
    
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchAlerts, refreshInterval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [threshold, autoRefresh, refreshInterval]);

  const fetchAlerts = async () => {
    try {
      const response = await getExpiryAlerts(threshold);
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching expiry alerts:', error);
      toast.error('Failed to load expiry alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleThresholdChange = (newThreshold) => {
    setThreshold(newThreshold);
  };

  const getDaysRemaining = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (daysRemaining) => {
    if (daysRemaining < 0) return { text: 'Expired', color: 'red', icon: '💀' };
    if (daysRemaining === 0) return { text: 'Expires Today', color: 'red', icon: '⚠️' };
    if (daysRemaining <= 1) return { text: `Expires in ${daysRemaining} day`, color: 'orange', icon: '🔥' };
    if (daysRemaining <= 3) return { text: `Expires in ${daysRemaining} days`, color: 'yellow', icon: '⏰' };
    return { text: `${daysRemaining} days left`, color: 'green', icon: '✅' };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const totalAlerts = (alerts?.totalExpiringSoon || 0) + (alerts?.totalExpired || 0);

  if (totalAlerts === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">📅</span>
          <div>
            <p className="text-green-800 font-medium">No expiry concerns!</p>
            <p className="text-green-600 text-sm">All items have valid expiry dates.</p>
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
        className="w-full flex justify-between items-center p-4 bg-orange-50 hover:bg-orange-100 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">📅</span>
          <div>
            <h3 className="font-semibold text-orange-800">Expiry Alerts</h3>
            <p className="text-sm text-orange-600">
              {alerts?.totalExpiringSoon} expiring soon • {alerts?.totalExpired} expired
            </p>
          </div>
        </div>
        <span className="text-orange-600">{expanded ? '▼' : '▶'}</span>
      </button>

      {/* Content */}
      {expanded && (
        <div className="p-4 space-y-4">
          {/* Threshold Selector */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <label className="text-sm text-gray-600">Show items expiring within:</label>
            <select
              value={threshold}
              onChange={(e) => handleThresholdChange(parseInt(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value={1}>1 day</option>
              <option value={3}>3 days</option>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
            </select>
          </div>

          {/* Expired Items */}
          {alerts?.expiredItems?.length > 0 && (
            <div>
              <h4 className="font-medium text-red-700 mb-2 flex items-center">
                <span className="mr-2">💀</span> Expired Items
              </h4>
              <div className="space-y-2">
                {alerts.expiredItems.map((item) => (
                  <div key={item._id} className="p-3 bg-red-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-red-600 font-medium">EXPIRED</p>
                        <p className="text-xs text-gray-500">
                          On: {new Date(item.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex space-x-2">
                      <button className="text-sm text-red-600 hover:text-red-800">
                        Discard Item
                      </button>
                      <button className="text-sm text-gray-500 hover:text-gray-700">
                        Add to Shopping List
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expiring Soon Items */}
          {alerts?.expiringSoon?.length > 0 && (
            <div>
              <h4 className="font-medium text-yellow-700 mb-2 flex items-center">
                <span className="mr-2">⏰</span> Expiring Soon
              </h4>
              <div className="space-y-2">
                {alerts.expiringSoon.map((item) => {
                  const daysRemaining = getDaysRemaining(item.expiryDate);
                  const status = getExpiryStatus(daysRemaining);
                  
                  return (
                    <div key={item._id} className="p-3 bg-yellow-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity} {item.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium text-${status.color}-600`}>
                            {status.icon} {status.text}
                          </p>
                          <p className="text-xs text-gray-500">
                            Expires: {new Date(item.expiryDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <button className="text-sm text-green-600 hover:text-green-800">
                          Use Now
                        </button>
                        <button className="text-sm text-blue-600 hover:text-blue-800">
                          Plan Recipe
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Button */}
          <Link
            to="/inventory"
            className="block text-center bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Review All Items
          </Link>
        </div>
      )}
    </div>
  );
};

export default ExpiryAlert;