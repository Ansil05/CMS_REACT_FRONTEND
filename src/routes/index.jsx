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
import StaffListPage from '../pages/Admin/StaffListPage';

//pharmacist pages
import MedicineList from '../components/Pharmasist/MedicineList';
import PharmacyHome from '../pages/Pharmasist/PharmacyHome';
import PrescriptionOrders from '../components/Pharmasist/PrescriptionOrders';
import PrescriptionList from '../components/Pharmasist/PrescriptionList';
import ConsultationList from '../components/Pharmasist/ConsultationList';
import BillsList from '../components/Pharmasist/BillsList';


// Doctor Pages
import DoctorHome from '../pages/Doctor/DoctorHome';
import ViewAppointments from '../pages/Doctor/ViewAppointments';
import ConsultPatient from '../pages/Doctor/ConsultPatient';
import ConsultationHistory from '../pages/Doctor/ConsultationHistory';

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
import TestRequests from '../pages/LabTechnician/TestRequests';
import TestBill from '../pages/LabTechnician/TestBill';
import TestResult from '../pages/LabTechnician/TestResult';
import TestList from '../pages/LabTechnician/TestList';






// Route Guards
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';
import PublicLandingPage from '../pages/PublicLandingPage';
import { useEffect } from 'react';



const AppRoutes = () => {
  const { isAuthenticated,user} = useAuth();
  // const { role } = useRole();
  console.log("AppRoutes - isAuthenticated:", isAuthenticated, "role:", user.role);
  // Get home route based on role
  const getHomeRoute = () => {
    const routes = {
      admin: '/app/admin',
      doctor: '/app/doctor',
      receptionist: '/app/receptionist',
      labtechnician: '/app/labtechnician',
      pharmacist: '/app/pharmacist',
    };
    return routes[user.role] || '/login';
  };
  // useEffect(() => {
  //   const handleStorageChange = () => {
  //     setIsAuthenticated(!!localStorage.getItem("accessToken"));
  //   };

  //   window.addEventListener("storage", handleStorageChange);
  //   return () => {
  //     window.removeEventListener("storage", handleStorageChange);
  //   };
  // }, [setIsAuthenticated]);
  

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
        <Login />
        }
      />  

      <Route path='/' element={<PublicLandingPage />} />

      {/* Protected Routes */}
      <Route 
        path="/app" 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Default redirect to role-specific home
        // <Route index element={<Navigate to={getHomeRoute()} replace />} /> */}

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
          <Route 
            path="staffs"
            element={
              <RoleBasedRoute allowedRoles={['admin']}>
                <StaffListPage />
              </RoleBasedRoute>
            }
          />
          
        </Route>

        {/* Doctor Routes */}
        <Route path="doctor">
          <Route
            index
            element={
              <RoleBasedRoute allowedRoles={['doctor', 'admin']}>
                <DoctorHome />
              </RoleBasedRoute>
            }
          />
          {/* ✅ ADD THESE 3 ROUTES */}
          <Route 
            path="appointments" 
            element={
              <RoleBasedRoute allowedRoles={['doctor', 'admin']}>
                <ViewAppointments />
              </RoleBasedRoute>
            } 
          />
          <Route 
            path="consult/:appointmentId" 
            element={
              <RoleBasedRoute allowedRoles={['doctor', 'admin']}>
                <ConsultPatient />
              </RoleBasedRoute>
            } 
          />
          <Route 
            path="consultations" 
            element={
              <RoleBasedRoute allowedRoles={['doctor', 'admin']}>
                <ConsultationHistory />
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
              <RoleBasedRoute allowedRoles={['receptionist', 'admin']}>
                <ReceptionistHome />
              </RoleBasedRoute>
            }
          />
          
          {/* Patient Routes */}
          <Route 
            path="patients" 
            element={
              <RoleBasedRoute allowedRoles={['receptionist', 'admin']}>
                <Patients />
              </RoleBasedRoute>
            } 
          />
          <Route 
            path="patients/add" 
            element={
              <RoleBasedRoute allowedRoles={['receptionist', 'admin']}>
                <AddPatient />
              </RoleBasedRoute>
            } 
          />
          <Route 
            path="patients/edit/:id" 
            element={
              <RoleBasedRoute allowedRoles={['receptionist', 'admin']}>
                <EditPatient />
              </RoleBasedRoute>
            } 
          />
          <Route 
            path="patients/view/:id" 
            element={
              <RoleBasedRoute allowedRoles={['receptionist', 'admin']}>
                <ViewPatient />
              </RoleBasedRoute>
            } 
          />
          
          {/* Appointment Routes */}
          <Route 
            path="appointments" 
            element={
              <RoleBasedRoute allowedRoles={['receptionist', 'admin']}>
                <Appointments />
              </RoleBasedRoute>
            } 
          />
          <Route 
            path="appointments/add" 
            element={
              <RoleBasedRoute allowedRoles={['receptionist', 'admin']}>
                <AddAppointment />
              </RoleBasedRoute>
            } 
          />
          
          {/* Billing Routes */}
          <Route 
            path="billing" 
            element={
              <RoleBasedRoute allowedRoles={['receptionist', 'admin']}>
                <Billing />
              </RoleBasedRoute>
            } 
          />
          <Route 
            path="billing/add" 
            element={
              <RoleBasedRoute allowedRoles={['receptionist', 'admin']}>
                <GenerateBill />
              </RoleBasedRoute>
            } 
          />
          <Route 
            path="billing/view/:id" 
            element={
              <RoleBasedRoute allowedRoles={['receptionist', 'admin']}>
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
              <RoleBasedRoute allowedRoles={['labtechnician', 'admin']}>
                <LabHome />
              </RoleBasedRoute>
            }
          />
          <Route
            path='testlist'
            element={
              <RoleBasedRoute allowedRoles={['labtechnician', 'admin']}>
                <TestList/>
              </RoleBasedRoute>
            }
          />
          <Route
            path='test-requests'
            element={
              <RoleBasedRoute allowedRoles={['labtechnician', 'admin']}>
                <TestRequests/>
              </RoleBasedRoute>
            }
          />
          <Route
            path='test-results'
            element={
              <RoleBasedRoute allowedRoles={['labtechnician', 'admin']}>
                <TestResult/>
              </RoleBasedRoute>
            }
          />
          <Route
            path='test-billing'
            element={
              <RoleBasedRoute allowedRoles={['labtechnician', 'admin']}>
                <TestBill/>
              </RoleBasedRoute>
            }
          />
        </Route>

        {/* Pharmacist Routes */}
       
    
       <Route path="pharmacist">
          <Route
            index
            element={
              <RoleBasedRoute allowedRoles={['pharmacist', 'admin']}>
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
