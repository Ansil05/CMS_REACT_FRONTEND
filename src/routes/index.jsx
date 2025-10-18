import React from 'react';
import { BrowserRouter } from 'react-router-dom';

export default function AppRoutes({ children }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}
