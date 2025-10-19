import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../context/RoleContext';

// Layouts
import MainLayout from '../ui/MainLayout';

// Auth Pages
import Login from '../pages/auth/Login';

// Common Pages
import Unauthorized from '../pages/Unauthorized';
import NotFound from '../pages/NotFound';

// Admin Pages
import AdminHome from '../pages/Admin/AdminHome';

// Doctor Pages
import DoctorHome from '../pages/Doctor/DoctorHome';

// Receptionist Pages
import ReceptionistHome from '../pages/Receptionist/ReceptionistHome';

// Lab Technician Pages
import LabHome from '../pages/LabTechnician/LabHome';

// Pharmacist Pages
import PharmacyHome from '../pages/Pharmasist/PharmacyHome';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const { role } = useRole();

  // Get home route based on role
  const getHomeRoute = () => {
    const routes = {
      admin: '/admin',
      doctor: '/doctor',
      receptionist: '/receptionist',
      labTechnician: '/lab-technician',
      pharmacist: '/pharmacist',
    };
    return routes[role] || '/login';
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to={getHomeRoute()} replace /> : <Login />
        } 
      />

      {/* Protected Routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Default redirect to role-specific home */}
        <Route index element={<Navigate to={getHomeRoute()} replace />} />

        {/* Admin Routes */}
        <Route path="admin/*">
          <Route
            index
            element={
              <RoleBasedRoute allowedRoles={['admin']}>
                <AdminHome />
              </RoleBasedRoute>
            }
          />
        </Route>

        {/* Doctor Routes */}
        <Route path="doctor/*">
          <Route
            index
            element={
              <RoleBasedRoute allowedRoles={['doctor']}>
                <DoctorHome />
              </RoleBasedRoute>
            }
          />
        </Route>

        {/* Receptionist Routes */}
        <Route path="receptionist/*">
          <Route
            index
            element={
              <RoleBasedRoute allowedRoles={['receptionist']}>
                <ReceptionistHome />
              </RoleBasedRoute>
            }
          />
        </Route>

        {/* Lab Technician Routes */}
        <Route path="lab-technician/*">
          <Route
            index
            element={
              <RoleBasedRoute allowedRoles={['lab-technician']}>
                <LabHome />
              </RoleBasedRoute>
            }
          />
        </Route>

        {/* Pharmacist Routes */}
        <Route path="pharmacist/*">
          <Route
            index
            element={
              <RoleBasedRoute allowedRoles={['pharmacist']}>
                <PharmacyHome />
              </RoleBasedRoute>
            }
          />
        </Route>
      </Route>

      {/* Error Pages */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;