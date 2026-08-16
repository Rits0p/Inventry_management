// orderService.js – Order API calls (admin & customer)
import api from './api';

export const orderService = {
  /**
   * Get all orders (Admin: all orders, Customer: own orders).
   * params: { status, search, page, page_size }
   */
  getOrders: async (params = {}) => {
    const { data } = await api.get('/orders/', { params });
    return data;
  },

  /**
   * Get a single order by ID.
   */
  getOrder: async (id) => {
    const { data } = await api.get(`/orders/${id}/`);
    return data;
  },

  /**
   * Place a new order (Customer only).
   * payload: { items: [{ product_id, quantity }], delivery_address }
   */
  placeOrder: async (payload) => {
    const { data } = await api.post('/orders/', payload);
    return data;
  },

  /**
   * Update order status (Admin only).
   * status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
   */
  updateStatus: async (id, status) => {
    const { data } = await api.patch(`/orders/${id}/`, { status });
    return data;
  },

  /**
   * Cancel an order (Customer or Admin).
   */
  cancelOrder: async (id) => {
    const { data } = await api.post(`/orders/${id}/cancel/`);
    return data;
  },
};
