import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaFileAlt, FaUsers, FaChartLine, FaSyncAlt } from 'react-icons/fa';
import { getDoctorAppointments, getConsultations } from '../../services/doctorService';
import LoadingSpinner from '../../ui/LoadingSpinner';

const DoctorHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const isInitialMount = useRef(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    totalConsultations: 0,
    pendingAppointments: 0,
  });

  const fetchDashboardData = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const [appointmentsData, consultationsData] = await Promise.all([
        getDoctorAppointments(),
        getConsultations(),
      ]);
      
      // Ensure appointments and consultations are arrays
      const appointments = Array.isArray(appointmentsData) ? appointmentsData : [];
      const consultations = Array.isArray(consultationsData) ? consultationsData : [];
      
      // Debug: Log appointment data to understand structure
      if (appointments && appointments.length > 0) {
        console.log('Sample appointment data:', appointments[0]);
        console.log('All appointment statuses:', appointments.map(app => app.status));
        console.log('Pending count calculation:', {
          total: appointments.length,
          withStatus: appointments.filter(app => app.status).length,
          withoutStatus: appointments.filter(app => !app.status).length,
          completed: appointments.filter(app => (app.status || '').toLowerCase() === 'completed').length,
          cancelled: appointments.filter(app => (app.status || '').toLowerCase() === 'cancelled').length,
        });
      }
      
      // Get today's and tomorrow's date in YYYY-MM-DD format (matching ViewAppointments logic)
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      // Handle both appointment_date and date fields
      const todayAppointments = appointments.filter(app => {
        const appDate = app.appointment_date || app.date;
        const dateStr = appDate?.split('T')[0] || appDate;
        return dateStr === todayStr;
      }).length;
      
      // Count pending appointments: only today's and tomorrow's appointments that are not completed or cancelled
      const pendingAppointments = appointments.filter(app => {
        const status = (app.status || '').toLowerCase().trim();
        
        // Exclude completed and cancelled appointments
        if (status && ['completed', 'cancelled'].includes(status)) {
          return false;
        }
        
        // Only count appointments for today or tomorrow (matching ViewAppointments)
        const appDate = app.appointment_date || app.date;
        if (!appDate) return false; // Skip if no date
        
        const dateStr = appDate.split('T')[0]; // Get date part only
        
        // Only include today or tomorrow's appointments
        return dateStr === todayStr || dateStr === tomorrowStr;
      }).length;
      setStats({
        totalAppointments: appointments.length,
        todayAppointments,
        totalConsultations: consultations.length,
        pendingAppointments,
      });
      
      // Enhanced debug logging for pending appointments
      const pendingDetails = appointments.filter(app => {
        const status = (app.status || '').toLowerCase().trim();
        if (status && ['completed', 'cancelled'].includes(status)) return false;
        const appDate = app.appointment_date || app.date;
        if (!appDate) return false;
        const dateStr = appDate.split('T')[0];
        return dateStr === todayStr || dateStr === tomorrowStr;
      });
      
      console.log('Dashboard stats updated:', {
        totalAppointments: appointments.length,
        todayAppointments,
        totalConsultations: consultations.length,
        pendingAppointments,
        todayStr,
        tomorrowStr,
        pendingDetails: pendingDetails.map(app => ({
          id: app.appointment_id || app.id,
          date: app.appointment_date || app.date,
          status: app.status,
          patientId: app.patient
        })),
        allAppointmentsBreakdown: appointments.map(app => ({
          id: app.appointment_id || app.id,
          date: app.appointment_date || app.date,
          status: app.status,
          isToday: (app.appointment_date || app.date)?.split('T')[0] === todayStr,
          isTomorrow: (app.appointment_date || app.date)?.split('T')[0] === tomorrowStr,
          isPending: !['completed', 'cancelled'].includes((app.status || '').toLowerCase().trim())
        }))
      });
    } catch (error) {
      // handle error
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    isInitialMount.current = false;
  }, [fetchDashboardData]);

  // Refresh when navigating back to this page from another route
  useEffect(() => {
    // Skip the initial mount since we already fetch on mount
    if (isInitialMount.current) return;
    
    if (location.pathname === '/app/doctor' || location.pathname === '/app/doctor/') {
      fetchDashboardData(true);
    }
  }, [location.pathname, fetchDashboardData]);

  // Refresh when window gains focus (user returns to tab)
  useEffect(() => {
    const handleFocus = () => {
      fetchDashboardData(true);
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchDashboardData]);

  const handleManualRefresh = () => {
    fetchDashboardData(true);
  };

  const dashboardCards = [
    { title: 'Total Appointments', value: stats.totalAppointments, icon: FaCalendarAlt, color: '#3498db', bgColor: '#ebf5fb' },
    { title: "Today's Appointments", value: stats.todayAppointments, icon: FaUsers, color: '#2ecc71', bgColor: '#e8f8f5' },
    { title: 'Total Consultations', value: stats.totalConsultations, icon: FaFileAlt, color: '#9b59b6', bgColor: '#f4ecf7' },
    { title: 'Pending Appointments', value: stats.pendingAppointments, icon: FaChartLine, color: '#e67e22', bgColor: '#fef5e7' },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontWeight: 600, color: '#2c3e50', marginBottom: 0 }}>Doctor Dashboard</h2>
        <button
          className="btn btn-outline-primary"
          onClick={handleManualRefresh}
          disabled={refreshing || loading}
          style={{ borderRadius: 8, padding: '8px 16px', display: 'flex', alignItems: 'center' }}
        >
          <FaSyncAlt 
            style={{ 
              marginRight: '8px',
              animation: refreshing ? 'spin 1s linear infinite' : 'none'
            }} 
          />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      <div className="row g-4 mb-4">
        {dashboardCards.map((card, idx) => (
          <div key={idx} className="col-xs-12 col-sm-6 col-lg-3">
            <div className="card" style={{ border: 'none', borderRadius: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', background: card.bgColor }}>
              <div className="card-body d-flex align-items-center justify-content-between p-4">
                <div>
                  <p className="mb-1" style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>{card.title}</p>
                  <h3 style={{ color: card.color, fontWeight: 'bold', marginBottom: 0 }}>{card.value}</h3>
                </div>
                <div style={{
                  width: 60, height: 60, borderRadius: 12, background: card.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <card.icon size={28} color="white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card" style={{ border: 'none', borderRadius: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', height: '100%' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <FaCalendarAlt size={24} color="#3498db" className="me-2" />
                <h5 className="mb-0" style={{ fontWeight: 600, color: '#2c3e50' }}>View Appointments</h5>
              </div>
              <p style={{ color: '#7f8c8d', marginBottom: 20, fontSize: '0.9rem' }}>View and manage your scheduled appointments</p>
              <button className="btn btn-primary" style={{ borderRadius: 8, padding: '10px 24px', fontWeight: 500 }}
                onClick={() => navigate('/app/doctor/appointments')}>View Appointments</button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card" style={{ border: 'none', borderRadius: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', height: '100%' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <FaFileAlt size={24} color="#9b59b6" className="me-2" />
                <h5 className="mb-0" style={{ fontWeight: 600, color: '#2c3e50' }}>Consultation History</h5>
              </div>
              <p style={{ color: '#7f8c8d', marginBottom: 20, fontSize: '0.9rem' }}>View your previous consultations and patient records</p>
              <button className="btn btn-primary" style={{ borderRadius: 8, padding: '10px 24px', fontWeight: 500, background: '#9b59b6', border: 'none' }}
                onClick={() => navigate('/app/doctor/consultations')}>View History</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorHome;