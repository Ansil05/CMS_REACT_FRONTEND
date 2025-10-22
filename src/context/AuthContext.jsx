import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({
    id: 1,
    username: '',
    email: '',
    role: ''
  });

  // Mock login - always succeeds
  const login = async (credentials) => {
    setIsAuthenticated(true);
    setUser({
      id: 1,
      username: credentials.username || 'user',
      email: credentials.email || 'user@clinic.com',
      role: credentials.role || 'receptionist'
    });
    return { success: true, role: credentials.role || 'receptionist' };
  };

  // Mock logout
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
