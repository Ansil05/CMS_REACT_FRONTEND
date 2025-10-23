import React from 'react';
import { Route } from 'react-router-dom';
import PharmacyHome from '../pages/Pharmasist/PharmacyHome';

// Import other pharmacist pages here

const pharmacistRoutes = [
  <Route key="pharmacist-home" path="/app/pharmacist" element={<PharmacyHome />} />,
  // Add more pharmacist routes here
];

export default pharmacistRoutes;
