import React, { createContext, useState, useContext } from "react";
import api from "../services/api"; // your axios instance
import { useRole } from "./RoleContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => ({
    access: localStorage.getItem("accessToken"),
    refresh: localStorage.getItem("refreshToken"),
  }));

  const [user, setUser] = useState(() => ({
    role: localStorage.getItem("role"),
    email: localStorage.getItem("email"),
  }));

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("accessToken")
  );

  // ✅ Login function (called from LoginContainer)
  const login = async (username, password) => {
    try {
      const response = await api.post("auth/login/", { username, password });

      const accessToken = response.data.tokens.access;
      const refreshToken = response.data.tokens.refresh;
      const role = response.data.role.toLowerCase();
      const email = response.data.email;
      // Store tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("role", role);
      localStorage.setItem("email", email);

      // Update state
      setAuthTokens({ access: accessToken, refresh: refreshToken });
      setUser({ role, email });
      setIsAuthenticated(true);

      return { success: true, role };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, message: "Invalid username or password" };
    }
  };

  // ✅ Logout function
  const logout = () => {
    localStorage.clear();
    setAuthTokens(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ authTokens, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook for easier access
export const useAuth = () => useContext(AuthContext);
