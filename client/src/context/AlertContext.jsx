// client/src/context/AlertContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getLowStockAlerts, getExpiryAlerts } from '../services/alertService';
import toast from 'react-hot-toast';

const AlertContext = createContext();

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [lowStockAlerts, setLowStockAlerts] = useState(null);
  const [expiryAlerts, setExpiryAlerts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchAlerts = useCallback(async () => {
    try {
      const [lowStockRes, expiryRes] = await Promise.all([
        getLowStockAlerts(),
        getExpiryAlerts(),
      ]);
      
      setLowStockAlerts(lowStockRes.data);
      setExpiryAlerts(expiryRes.data);
      setLastUpdated(new Date());
      
      // Show toast notifications for new alerts
      const totalLowStock = lowStockRes.data?.totalLowStock || 0;
      const totalExpiring = expiryRes.data?.totalExpiringSoon || 0;
      
      if (totalLowStock > 0) {
        toast(`⚠️ ${totalLowStock} item(s) are low in stock!`, {
          duration: 5000,
          icon: '⚠️',
        });
      }
      
      if (totalExpiring > 0) {
        toast(`📅 ${totalExpiring} item(s) will expire soon!`, {
          duration: 5000,
          icon: '📅',
        });
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchAlerts, 30000); // Refresh every 30 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchAlerts, autoRefresh]);

  const hasAlerts = () => {
    const lowStockCount = lowStockAlerts?.totalLowStock || 0;
    const expiringCount = expiryAlerts?.totalExpiringSoon || 0;
    return lowStockCount > 0 || expiringCount > 0;
  };

  const getTotalAlertCount = () => {
    return (lowStockAlerts?.totalLowStock || 0) + (expiryAlerts?.totalExpiringSoon || 0);
  };

  const dismissAlert = (type, itemId) => {
    // This would require backend support to mark alerts as dismissed
    console.log(`Dismissing ${type} alert for item ${itemId}`);
    // For now, just refresh alerts
    fetchAlerts();
  };

  const value = {
    lowStockAlerts,
    expiryAlerts,
    loading,
    lastUpdated,
    autoRefresh,
    setAutoRefresh,
    fetchAlerts,
    hasAlerts,
    getTotalAlertCount,
    dismissAlert,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
};