import React from "react";
import { Form, Button, Alert } from "react-bootstrap";

const LoginForm = ({ formData, handleChange, handleSubmit, error, loading }) => {
  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3" controlId="formUsername">
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

      <Form.Group className="mb-3" controlId="formPassword">
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

      <Button
        style={{background:"#2e7d32",color:"white",border:"none"}}
        type="submit"
        className="w-100"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </Button>
      <small>
                  Don’t have an account? <a href="/signup">Sign up</a>
                </small>
    </Form>
    
  );
};

export default LoginForm;
