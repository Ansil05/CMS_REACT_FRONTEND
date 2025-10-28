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

//pharmacist pages
import MedicineList from '../components/Pharmasist/MedicineList';
import PharmacyHome from '../pages/Pharmasist/PharmacyHome';
import PrescriptionOrders from '../components/Pharmasist/PrescriptionOrders';
import PrescriptionList from '../components/Pharmasist/PrescriptionList';
import ConsultationList from '../components/Pharmasist/ConsultationList';
import BillsList from '../components/Pharmasist/BillsList';


// Doctor Pages
import DoctorHome from '../pages/Doctor/DoctorHome';

// Receptionist Pages
import ReceptionistHome from '../pages/Receptionist/ReceptionistHome';
import Patients from '../pages/Receptionist/Patients';
import AddPatient from '../pages/Receptionist/AddPatient';
import EditPatient from '../pages/Receptionist/EditPatient';
import ViewPatient from '../pages/Receptionist/ViewPatient';
import Appointments from '../pages/Receptionist/Appointments';
import AddAppointment from '../pages/Receptionist/AddAppointment';
import Billing from '../pages/Receptionist/Billing';
import GenerateBill from '../pages/Receptionist/GenerateBill';
import ViewBill from '../pages/Receptionist/ViewBill';

// Lab Technician Pages
import LabHome from '../pages/LabTechnician/LabHome';



// Route Guards
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';
import PublicLandingPage from '../pages/PublicLandingPage';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const { role } = useRole();

  // Get home route based on role
  const getHomeRoute = () => {
    const routes = {
      admin: '/app/admin',
      doctor: '/app/doctor',
      receptionist: '/app/receptionist',
      labTechnician: '/app/lab-technician',
      pharmacist: '/app/pharmacist',
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
      <Route path='/'
      element={<PublicLandingPage />}/>

      
      {/* Protected Routes */}
      <Route 
        path="/app" 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Default redirect to role-specific home */}
        <Route index element={<Navigate to={getHomeRoute()} replace />} />

        {/* Admin Routes */}
        <Route path="admin">
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
        <Route path="doctor">
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
        <Route path="receptionist">
          {/* Dashboard */}
          <Route
            index
            element={
              <RoleBasedRoute allowedRoles={['receptionist']}>
                <ReceptionistHome />
              </RoleBasedRoute>
            }
          />
          
          {/* Patient Routes */}
          <Route 
            path="patients" 
            element={
              <RoleBasedRoute allowedRoles={['receptionist']}>
                <Patients />
              </RoleBasedRoute>
            } 
          />
          <Route 
            path="patients/add" 
            element={
              <RoleBasedRoute allowedRoles={['receptionist']}>
                <AddPatient />
              </RoleBasedRoute>
            } 
          />
          <Route 
            path="patients/edit/:id" 
            element={
              <RoleBasedRoute allowedRoles={['receptionist']}>
                <EditPatient />
              </RoleBasedRoute>
            } 
          />
          <Route 
            path="patients/view/:id" 
            element={
              <RoleBasedRoute allowedRoles={['receptionist']}>
                <ViewPatient />
              </RoleBasedRoute>
            } 
          />
          
          {/* Appointment Routes */}
          <Route 
            path="appointments" 
            element={
              <RoleBasedRoute allowedRoles={['receptionist']}>
                <Appointments />
              </RoleBasedRoute>
            } 
          />
          <Route 
            path="appointments/add" 
            element={
              <RoleBasedRoute allowedRoles={['receptionist']}>
                <AddAppointment />
              </RoleBasedRoute>
            } 
          />
          
          {/* Billing Routes */}
          <Route 
            path="billing" 
            element={
              <RoleBasedRoute allowedRoles={['receptionist']}>
                <Billing />
              </RoleBasedRoute>
            } 
          />
          <Route 
            path="billing/add" 
            element={
              <RoleBasedRoute allowedRoles={['receptionist']}>
                <GenerateBill />
              </RoleBasedRoute>
            } 
          />
          <Route 
            path="billing/view/:id" 
            element={
              <RoleBasedRoute allowedRoles={['receptionist']}>
                <ViewBill />
              </RoleBasedRoute>
            } 
          />
        </Route>

        {/* Lab Technician Routes */}
        <Route path="lab-technician">
          <Route
            index
            element={
              <RoleBasedRoute allowedRoles={['labTechnician']}>
                <LabHome />
              </RoleBasedRoute>
            }
          />
        </Route>

        {/* Pharmacist Routes */}
       
    
       <Route path="pharmacist">
          <Route
            index
            element={
              <RoleBasedRoute allowedRoles={['pharmacist']}>
                <PharmacyHome />
              </RoleBasedRoute>
            }
          />
          {/* Add this new route */}
          <Route
            path="medicines"
            element={
              <RoleBasedRoute allowedRoles={['pharmacist']}>
                <MedicineList />
              </RoleBasedRoute>
            }
          />
            {/* Orders - Prescription Orders */}
            <Route
              path="orders"
              element={
                <RoleBasedRoute allowedRoles={['pharmacist']}>
                  <PrescriptionOrders />
                </RoleBasedRoute>
              }
            />
              {/* Bills */}
            <Route
              path="bills"
              element={
                <RoleBasedRoute allowedRoles={['pharmacist']}>
                  <BillsList />
                </RoleBasedRoute>
              }
            />

             <Route
              path="inventory"
              element={
                <RoleBasedRoute allowedRoles={['pharmacist']}>
                  <MedicineList />
                </RoleBasedRoute>
              }
            />
             {/* Optional: Prescription List (if you want separate from orders) */}
              <Route
                path="prescriptions"
                element={
                  <RoleBasedRoute allowedRoles={['pharmacist']}>
                    <PrescriptionList />
                  </RoleBasedRoute>
                }
              />
              
              {/* Optional: Consultation List */}
              <Route
                path="consultations"
                element={
                  <RoleBasedRoute allowedRoles={['pharmacist']}>
                    <ConsultationList />
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
