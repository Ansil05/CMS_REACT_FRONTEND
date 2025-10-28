import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import api from "../../services/api";
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../context/RoleContext'; // ← ADD THIS IMPORT

const LoginContainer = () => {
  const { login } = useAuth();
  const { setRole } = useRole(); // ← ADD THIS LINE
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("auth/login/", formData);

      const accessToken = response.data.tokens.access;
      const refreshToken = response.data.tokens.refresh;
      const role = response.data.role;

      // Store tokens and role
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("role", role);
      localStorage.setItem("token", accessToken); // ← ADD THIS (for API calls)

      console.log("Login successful, role:", role);
      console.log("LocalStorage:", localStorage);

      // Update context
      login();
      setRole(role); // ← ADD THIS LINE

      // Navigate based on role - ADD THIS ENTIRE SECTION
      const routes = {
        admin: '/app/admin',
        doctor: '/app/doctor',
        receptionist: '/app/receptionist',
        labtechnician: '/app/lab-technician',
        pharmacist: '/app/pharmacist',
      };

      const targetRoute = routes[role.toLowerCase()] || '/app';
      console.log("Navigating to:", targetRoute);
      
      navigate(targetRoute, { replace: true }); // ← ADD THIS LINE

    } catch (err) {
      console.error("Login error:", err);
      if (err.response && err.response.status === 401) {
        setError("Invalid username or password");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginForm
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      error={error}
      loading={loading}
    />
  );
};

export default LoginContainer;
