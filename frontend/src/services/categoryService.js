// categoryService.js – Category API calls (admin)
import api from './api';

export const categoryService = {
  getCategories: async (params = {}) => {
    const { data } = await api.get('/categories/', { params });
    return data;
  },

  getCategory: async (id) => {
    const { data } = await api.get(`/categories/${id}/`);
    return data;
  },

  createCategory: async (payload) => {
    const { data } = await api.post('/categories/', payload);
    return data;
  },

  updateCategory: async (id, payload) => {
    const { data } = await api.patch(`/categories/${id}/`, payload);
    return data;
  },

  deleteCategory: async (id) => {
    await api.delete(`/categories/${id}/`);
  },
};
