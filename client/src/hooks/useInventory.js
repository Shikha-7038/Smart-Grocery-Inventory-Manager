// client/src/hooks/useInventory.js
import { useState, useEffect, useCallback } from 'react';
import { getGroceryItems, updateQuantity, deleteGroceryItem } from '../services/groceryService';
import toast from 'react-hot-toast';

const useInventory = (initialFilters = {}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getGroceryItems({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });
      setItems(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.pagination?.total || 0,
        pages: response.pagination?.pages || 0,
      }));
      setError(null);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('Failed to load inventory items');
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const updateItemQuantity = async (id, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 0) {
      toast.error('Quantity cannot be negative');
      return false;
    }
    
    try {
      await updateQuantity(id, Math.abs(change), change > 0 ? 'increment' : 'decrement');
      toast.success('Quantity updated');
      fetchItems();
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
      return false;
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return false;
    }
    
    try {
      await deleteGroceryItem(id);
      toast.success('Item deleted successfully');
      fetchItems();
      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
      return false;
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const goToPage = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const getLowStockItems = () => {
    return items.filter(item => item.quantity <= item.minStockLevel && item.quantity > 0);
  };

  const getOutOfStockItems = () => {
    return items.filter(item => item.quantity === 0);
  };

  const getExpiringItems = (days = 3) => {
    const today = new Date();
    const threshold = new Date();
    threshold.setDate(today.getDate() + days);
    
    return items.filter(item => {
      if (!item.expiryDate) return false;
      const expiry = new Date(item.expiryDate);
      return expiry <= threshold && expiry >= today;
    });
  };

  const getTotalValue = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return {
    items,
    loading,
    error,
    filters,
    pagination,
    fetchItems,
    updateItemQuantity,
    deleteItem,
    updateFilters,
    goToPage,
    getLowStockItems,
    getOutOfStockItems,
    getExpiringItems,
    getTotalValue,
  };
};

export default useInventory;