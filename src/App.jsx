import React from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RoleProvider } from './context/RoleContext';
import AppRoutes from './routes/index.jsx';

function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </RoleProvider>
    </AuthProvider>
  );
}

export default App;
