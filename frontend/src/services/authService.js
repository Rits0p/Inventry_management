// authService.js – Auth API calls (login, register, logout, refresh)
import api from './api';

export const authService = {
  /**
   * Login with email + password. Returns JWT tokens + user data.
   */
  login: async (email, password) => {
    const { data } = await api.post('/auth/login/', { email, password });
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    return data;
  },

  /**
   * Register a new user account.
   */
  register: async (payload) => {
    // payload: { fullName, email, password, role }
    const { data } = await api.post('/auth/register/', payload);
    return data;
  },

  /**
   * Logout – blacklist refresh token on server, remove tokens from storage.
   */
  logout: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        await api.post('/auth/logout/', { refresh: refreshToken });
      } catch {
        // token may already be blacklisted or expired – ignore
      }
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  /**
   * Get authenticated user's profile.
   */
  getProfile: async () => {
    const { data } = await api.get('/auth/me/');
    return data;
  },

  /**
   * Change password.
   */
  changePassword: async (oldPassword, newPassword) => {
    const { data } = await api.post('/auth/change-password/', {
      old_password: oldPassword,
      new_password: newPassword,
    });
    return data;
  },
};
