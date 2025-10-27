import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import doctorService from '../../services/doctorService';
import Table from '../../ui/Table';
import Button from '../../elements/Button';
import Badge from '../../elements/Badge';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { formatDate, formatTime } from '../../utils/validations';

const AppointmentList = ({
  statusFilter = 'all', // 'all', 'scheduled', 'completed', etc.
  showActions = true,
}) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line
  }, [statusFilter]);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      const data = await doctorService.getAppointments(params);
      setAppointments(data.results || data); // adapt to either paginated or plain array
    } catch (err) {
      setError('Error fetching appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleConsult = (appointmentId) => {
    navigate(`/app/doctor/consult/${appointmentId}`);
  };

  const handleDetails = (appointmentId) => {
    navigate(`/app/doctor/appointments/${appointmentId}`);
  };

  const handleComplete = async (appointmentId) => {
    try {
      await doctorService.updateAppointmentStatus(appointmentId, 'completed');
      fetchAppointments();
    } catch (err) {
      setError('Failed to complete appointment');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      scheduled: 'primary',
      confirmed: 'success',
      pending: 'warning',
      completed: 'info',
      cancelled: 'danger',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'patient', label: 'Patient ID', render: row => row.patient || '-' },
    { key: 'patient_name', label: 'Patient', render: row => row.patient_name || '-' },
    { key: 'appointment_date', label: 'Date', render: row => formatDate(row.appointment_date) },
    { key: 'appointment_time', label: 'Time', render: row => formatTime(row.appointment_time) },
    { key: 'reason', label: 'Reason' },
    { key: 'status', label: 'Status', render: row => getStatusBadge(row.status) },
  ];

  if (showActions) {
    columns.push({
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            size="small"
            variant="primary"
            onClick={() => handleDetails(row.id)}
          >
            Details
          </Button>
          {(row.status === 'scheduled' || row.status === 'confirmed' || row.status === 'pending') && (
            <Button
              size="small"
              variant="success"
              onClick={() => handleConsult(row.id)}
            >
              Start Consult
            </Button>
          )}
          {row.status !== 'completed' && row.status !== 'cancelled' && (
            <Button
              size="small"
              variant="info"
              onClick={() => handleComplete(row.id)}
            >
              Mark Completed
            </Button>
          )}
        </div>
      ),
    });
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <div style={{ color: 'red', padding: '1rem' }}>{error}</div>;

  return (
    <div style={{ padding: '1rem 0' }}>
      <Table
        data={appointments}
        columns={columns}
        emptyMessage="No appointments found."
      />
    </div>
  );
};

export default AppointmentList;
