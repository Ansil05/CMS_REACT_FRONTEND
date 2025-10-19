import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleLogin() {
    login();
    navigate('/');
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Login</h2>
      <p>This is a development login. Click to continue as receptionist.</p>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
