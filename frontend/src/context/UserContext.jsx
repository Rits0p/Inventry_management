import React, { useState } from 'react';

// UserContext – manages authenticated user state globally
// Replace mock with real JWT auth later

const UserContext = React.createContext(null);

const mockUser = {
  id: 1,
  fullName: 'John Doe',
  email: 'john.doe@email.com',
  role: 'Customer', // 'Admin' | 'Customer'
  avatar: null,
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(mockUser); // null when logged out

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default UserContext;
