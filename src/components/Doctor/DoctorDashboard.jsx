import React, { useEffect, useState } from 'react';
import doctorService from '../../services/doctorService';
import StatCard from '../../ui/StatCard';
import LoadingSpinner from '../../ui/LoadingSpinner';
import AppointmentList from './AppointmentList';

const DoctorDashboard = () => {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    completedToday: 0,
    totalPatients: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
    // eslint-disable-next-line
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setDashboardError(null);
    try {
      // Pulls from /doctor/dashboard/ or whatever your backend view is
      const data = await doctorService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setDashboardError('Error loading dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (dashboardError) return <div style={{ color: 'red' }}>{dashboardError}</div>;

  return (
    <div>
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        <StatCard label="Today's Appointments" value={stats.todayAppointments} color="#5b7ae0" />
        <StatCard label="Completed Today" value={stats.completedToday} color="#26c281" />
        <StatCard label="Total Patients" value={stats.totalPatients} color="#f59e0b" />
        <StatCard label="Pending" value={stats.pending} color="#ff7043" />
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Today's Appointments</h3>
        <AppointmentList statusFilter="scheduled" />
      </div>
    </div>
  );
};

export default DoctorDashboard;
