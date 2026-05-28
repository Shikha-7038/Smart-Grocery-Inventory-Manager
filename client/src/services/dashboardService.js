// client/src/services/dashboardService.js
import api from './api';

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const getRecentItems = async () => {
  const response = await api.get('/dashboard/recent');
  return response.data;
};

export const getCategoryBreakdown = async () => {
  const response = await api.get('/dashboard/categories');
  return response.data;
};

export const getShoppingList = async () => {
  const response = await api.get('/dashboard/shopping-list');
  return response.data;
};