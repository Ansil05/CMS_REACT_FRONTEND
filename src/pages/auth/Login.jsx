import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../context/RoleContext';
import React, { useState } from "react";
import { Form, Button, Card, Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import LoginContainer from '../../components/Auth/LoginContainer';

const Login = () => {
  console.log("Rendering Login component");
  const { login } = useAuth();
  const { setRole } = useRole();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "", role: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault(); // prevent reload
    if (!formData.username || !formData.password || !formData.role) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    // Simulate login delay
    setTimeout(() => {
      login(); // set isAuthenticated = true
      setRole(formData.role); // store selected role

      // Navigate to role-based page
      const routes = {
        admin: "/admin",
        doctor: "/doctor",
        receptionist: "/receptionist",
        labTechnician: "/lab-technician",
        pharmacist: "/pharmacist",
      };

      navigate(routes[formData.role] || "/");
      setLoading(false);
    }, 800);
  };

  return (<Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Row className="w-100">
        <Col md={{ span: 4, offset: 4 }}>
          <h3 className="text-center mb-4">Login</h3>
          <LoginContainer />
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
