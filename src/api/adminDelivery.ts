import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('proteinbox_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const apiClient = axios.create({
  baseURL: `${API_URL}/admin/delivery`,
});

apiClient.interceptors.request.use((config) => {
  const headers = getAuthHeaders();
  if (headers.Authorization) {
    config.headers.Authorization = headers.Authorization;
  }
  return config;
});

export const adminDeliveryApi = {
  getStaff: async () => {
    const res = await apiClient.get('/staff');
    return res.data.data;
  },
  createStaff: async (data: any) => {
    const res = await apiClient.post('/staff', data);
    return res.data.data;
  },
  getTodayDeliveries: async () => {
    const res = await apiClient.get('/today');
    return res.data.data;
  },
  getStats: async () => {
    const res = await apiClient.get('/stats');
    return res.data.data;
  },
  assignDelivery: async (deliveryId: string, deliveryBoyId: string) => {
    const res = await apiClient.patch(`/assign/${deliveryId}`, { deliveryBoyId });
    return res.data.data;
  },
  bulkAssign: async (data: any) => {
    const res = await apiClient.post('/bulk-assign', data);
    return res.data.data;
  }
};
