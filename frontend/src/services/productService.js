// productService.js – Product API calls (admin & customer)
import api from './api';

export const productService = {
  /**
   * Get all products with optional filters.
   * params: { category, search, page, page_size, ordering }
   */
  getProducts: async (params = {}) => {
    const { data } = await api.get('/products/', { params });
    return data;
  },

  /**
   * Get a single product by ID.
   */
  getProduct: async (id) => {
    const { data } = await api.get(`/products/${id}/`);
    return data;
  },

  /**
   * Create a new product (Admin only).
   */
  createProduct: async (payload) => {
    const { data } = await api.post('/products/', payload);
    return data;
  },

  /**
   * Update an existing product (Admin only).
   */
  updateProduct: async (id, payload) => {
    const { data } = await api.patch(`/products/${id}/`, payload);
    return data;
  },

  /**
   * Delete a product (Admin only).
   */
  deleteProduct: async (id) => {
    await api.delete(`/products/${id}/`);
  },

  /**
   * Adjust product stock (Admin only).
   * type: 'add' | 'remove' | 'set'
   */
  adjustStock: async (id, type, quantity) => {
    const { data } = await api.post(`/products/${id}/adjust-stock/`, {
      type,
      quantity,
    });
    return data;
  },
};
