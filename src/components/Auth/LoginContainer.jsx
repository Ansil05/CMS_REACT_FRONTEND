import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import { useAuth } from "../../context/AuthContext";

const LoginContainer = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { username, password } = formData;

    try {
      const result = await login(username, password);

      if (result.success) {
        console.log("Login successful, role:", result.role);
        navigate("/dashboard"); // redirect after login
      } else {
        setError(result.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
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
