// useAuth.js – Custom hook for user authentication state
import { useContext } from 'react';
import UserContext from '../context/UserContext';

/**
 * Returns the authenticated user and helper methods.
 *
 * Usage:
 *   const { user, isAdmin, isCustomer, isAuthenticated, login, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAuth must be used within a UserProvider');
  }

  const { user, isLoading, login, logout } = context;

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'Admin',
    isCustomer: user?.role === 'Customer',
  };
}
