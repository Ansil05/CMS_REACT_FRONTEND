import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Remove useNavigate from here - it's outside Router!
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Always authenticated for testing
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
      username: credentials.username || 'receptionist',
      email: credentials.email || 'receptionist@clinic.com',
      role: 'receptionist'
    });
    return true;
  };

  // Mock logout - just clear state, navigate will be done in component
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    // Don't navigate here - let the component handle it
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
