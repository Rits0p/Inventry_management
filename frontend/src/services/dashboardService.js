// dashboardService.js — Admin & Customer dashboard statistics
import api from './api';

export const dashboardService = {
  getAdminStats: async () => {
    const { data } = await api.get('/dashboard/admin/');
    return data;
  },

  getCustomerStats: async () => {
    const { data } = await api.get('/dashboard/customer/');
    return data;
  },
};
