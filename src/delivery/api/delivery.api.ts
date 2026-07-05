import axios from 'axios';
import { DeliveryStatus } from '../types/delivery.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('delivery_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const apiClient = axios.create({
  baseURL: `${API_URL}/delivery`,
});

apiClient.interceptors.request.use((config) => {
  const headers = getAuthHeaders();
  if (headers.Authorization) {
    config.headers.Authorization = headers.Authorization;
  }
  return config;
});

export const deliveryApi = {
  login: async (mobile: string, passwordPlain: string) => {
    const res = await axios.post(`${API_URL}/delivery/auth/login`, { mobile, password: passwordPlain });
    return res.data;
  },

  getTodayDeliveries: async () => {
    const res = await apiClient.get('/today');
    return res.data.data;
  },

  getPendingDeliveries: async () => {
    const res = await apiClient.get('/pending');
    return res.data.data;
  },

  getCompletedDeliveries: async (date?: string) => {
    const params = date ? { date } : {};
    const res = await apiClient.get('/completed', { params });
    return res.data.data;
  },

  getStats: async () => {
    const res = await apiClient.get('/stats');
    return res.data.data;
  },

  getDeliveryDetails: async (id: string) => {
    const res = await apiClient.get(`/customer/${id}`);
    return res.data.data;
  },

  updateStatus: async (id: string, status: DeliveryStatus, reason?: string) => {
    const res = await apiClient.patch(`/${id}/status`, { status, failedReason: reason });
    return res.data.data;
  },

  markOutForDelivery: async (id: string) => {
    const res = await apiClient.patch(`/${id}/out-for-delivery`);
    return res.data.data;
  },
};
