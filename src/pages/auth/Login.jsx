import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useRole } from "../../context/RoleContext";
import LoginContainer from "../../components/Auth/LoginContainer";

const Login = () => {
  const { isAuthenticated, user } = useAuth();
  const { setRole } = useRole();
  const navigate = useNavigate();

  // ✅ Redirect if already logged in
  useEffect(() => {
    
    if (isAuthenticated && user?.role) {
      const routes = {
        admin: "/app/admin",
        doctor: "/app/doctor",
        receptionist: "/app/receptionist",
        labtechnician: "/app/lab-technician",
        pharmacist: "/app/pharmacist",
      };
      setRole(user.role);
      navigate(routes[user.role] || "/");
    }
  }, [isAuthenticated, user, setRole, navigate]);

  return (
    
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Row className="w-100">
        <Col md={{ span: 4, offset: 4 }}>
          <h3 className="text-center mb-4">Login</h3>
          {/* ✅ LoginContainer handles the form and login logic */}
          <LoginContainer />
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
