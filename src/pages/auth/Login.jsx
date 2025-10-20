import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../context/RoleContext';
import React, { useState } from "react";
import { Form, Button, Card, Container, Row, Col, Alert, Spinner } from "react-bootstrap";

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

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row>
        <Col>
          <Card style={{ width: "24rem", padding: "20px", borderRadius: "15px" }}>
            <Card.Body>
              <h3 className="text-center mb-4">Login</h3>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="role">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select role</option>
                    <option value="admin">Admin</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="doctor">Doctor</option>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="labTechnician">Lab Technician</option>
                  </Form.Select>
                </Form.Group>

                <div className="d-grid">
                  <Button style={{background:"#2e7d32",color:"white",border:"none"}} type="submit" disabled={loading}>
                    {loading ? <Spinner size="sm" animation="border" /> : "Login"}
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-3">
                <small>
                  Don’t have an account? <a href="/signup">Sign up</a>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
