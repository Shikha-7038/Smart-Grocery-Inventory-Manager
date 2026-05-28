// client/src/services/alertService.js
import api from './api';

export const getLowStockAlerts = async () => {
  const response = await api.get('/alerts/low-stock');
  return response.data;
};

export const getExpiryAlerts = async (days = 3) => {
  const response = await api.get(`/alerts/expiry?days=${days}`);
  return response.data;
};

export const getAllAlerts = async () => {
  const response = await api.get('/alerts/all');
  return response.data;
};