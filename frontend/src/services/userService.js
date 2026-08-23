// userService.js — Profile management API calls
import api from './api';

export const userService = {
  getProfile: async () => {
    const { data } = await api.get('/auth/me/');
    return data;
  },

  updateProfile: async (payload) => {
    // payload: { fullName, phone_number, address }
    const { data } = await api.patch('/auth/profile/', payload);
    return data;
  },
};
