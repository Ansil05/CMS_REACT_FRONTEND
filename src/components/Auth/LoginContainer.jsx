import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useRole } from "../../context/RoleContext";

const LoginContainer = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setRole } = useRole();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Make API call
      const response = await api.post("auth/login/", formData);

      const accessToken = response.data.tokens.access;
      const refreshToken = response.data.tokens.refresh;
      
      const email = response.data.email;

      // ✅ Normalize the role (case-insensitive fix)
      const role = response.data.role
        ? response.data.role.trim().toLowerCase()
        : "";

      // Save tokens + normalized role
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("role", role);
      localStorage.setItem("email", email);


      console.log("✅ Login Successful | Normalized Role:", role);

      // Update global context
      login();
      setRole(role);

      // ✅ Navigate to dashboard based on role
      const routes = {
        admin: "/app/admin",
        doctor: "/app/doctor",
        receptionist: "/app/receptionist",
        labtechnician: "/app/lab-technician",
        pharmacist: "/app/pharmacist",
      };

      navigate(routes[role] || "/app/receptionist");
    } catch (err) {
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
