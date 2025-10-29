import React from 'react';
import { Route } from 'react-router-dom';
import PharmacyHome from '../pages/Pharmasist/PharmacyHome';
// Import other pharmacist pages here
import PrescriptionList from './components/Pharmacist/PrescriptionList';
import PrescriptionOrders from '../components/Pharmacist/PrescriptionOrders';
import ConsultationList from '../components/Pharmasist/ConsultationList';
const pharmacistRoutes = [
  <Route key="pharmacist-home" path="/app/pharmacist" element={<PharmacyHome />} />,
  <Route path="/app/pharmacist/prescriptions" element={<PrescriptionList />} />,
  <Route path="/app/pharmacist/consultations" element={<ConsultationList />} /> ,
  <Route path="/app/pharmacist/orders" element={<PrescriptionOrders />} />
];

export default pharmacistRoutes;
