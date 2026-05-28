// client/src/services/groceryService.js
import api from './api';

// Get all grocery items with filters
export const getGroceryItems = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/grocery?${params}`);
  return response.data;
};

// Get single grocery item
export const getGroceryItemById = async (id) => {
  const response = await api.get(`/grocery/${id}`);
  return response.data;
};

// Create new grocery item
export const createGroceryItem = async (itemData) => {
  const response = await api.post('/grocery', itemData);
  return response.data;
};

// Update grocery item
export const updateGroceryItem = async (id, itemData) => {
  const response = await api.put(`/grocery/${id}`, itemData);
  return response.data;
};

// Delete grocery item
export const deleteGroceryItem = async (id) => {
  const response = await api.delete(`/grocery/${id}`);
  return response.data;
};

// Update quantity
export const updateQuantity = async (id, quantity, operation = 'set') => {
  const response = await api.patch(`/grocery/${id}/quantity`, { quantity, operation });
  return response.data;
};