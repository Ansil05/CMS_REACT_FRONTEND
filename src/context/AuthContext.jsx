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
    // setUser({
    //   id: 1,
    //   username: credentials.username || 'receptionist',
    //   email: credentials.email || 'receptionist@clinic.com',
    //   role: 'receptionist'
    // });
    return true;
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
