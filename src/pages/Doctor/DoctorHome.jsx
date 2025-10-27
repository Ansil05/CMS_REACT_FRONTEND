import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaFileAlt, FaUsers, FaChartLine } from 'react-icons/fa';
import { getDoctorAppointments, getConsultations } from '../../services/doctorService';
import LoadingSpinner from '../../ui/LoadingSpinner';

const DoctorHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    totalConsultations: 0,
    pendingAppointments: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [appointments, consultations] = await Promise.all([
          getDoctorAppointments(),
          getConsultations(),
        ]);
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = appointments.filter(app => app.date === today).length;
        const pendingAppointments = appointments.filter(app => app.status === 'Scheduled').length;
        setStats({
          totalAppointments: appointments.length,
          todayAppointments,
          totalConsultations: consultations.length,
          pendingAppointments,
        });
      } catch (error) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const dashboardCards = [
    { title: 'Total Appointments', value: stats.totalAppointments, icon: FaCalendarAlt, color: '#3498db', bgColor: '#ebf5fb' },
    { title: "Today's Appointments", value: stats.todayAppointments, icon: FaUsers, color: '#2ecc71', bgColor: '#e8f8f5' },
    { title: 'Total Consultations', value: stats.totalConsultations, icon: FaFileAlt, color: '#9b59b6', bgColor: '#f4ecf7' },
    { title: 'Pending Appointments', value: stats.pendingAppointments, icon: FaChartLine, color: '#e67e22', bgColor: '#fef5e7' },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container p-4">
      <h2 className="mb-4" style={{ fontWeight: 600, color: '#2c3e50' }}>Doctor Dashboard</h2>
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
