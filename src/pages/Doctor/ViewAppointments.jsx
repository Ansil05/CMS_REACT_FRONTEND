import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Badge, Form } from 'react-bootstrap';
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getDoctorAppointments } from '../../services/doctorService';
import Table from '../../ui/Table';
import LoadingSpinner from '../../ui/LoadingSpinner';
import EmptyState from '../../ui/EmptyState';
import Alert from '../../ui/Alert';

const ViewAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [searchTerm, filterDate, appointments]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getDoctorAppointments();
      setAppointments(data);
      setFilteredAppointments(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch appointments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.patient_phone.includes(searchTerm)
      );
    }

    if (filterDate) {
      filtered = filtered.filter((app) => app.date === filterDate);
    }

    setFilteredAppointments(filtered);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Scheduled: { bg: 'primary', text: 'Scheduled' },
      Completed: { bg: 'success', text: 'Completed' },
      Cancelled: { bg: 'danger', text: 'Cancelled' },
    };

    const style = statusStyles[status] || { bg: 'secondary', text: status };
    return <Badge bg={style.bg}>{style.text}</Badge>;
  };

  const columns = [
    {
      header: 'Appointment ID',
      accessor: 'appointment_id',
      render: (value) => `#${value}`,
    },
    {
      header: 'Patient Name',
      accessor: 'patient_name',
    },
    {
      header: 'Age',
      accessor: 'patient_age',
    },
    {
      header: 'Phone',
      accessor: 'patient_phone',
    },
    {
      header: 'Date',
      accessor: 'date',
    },
    {
      header: 'Time',
      accessor: 'time',
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => getStatusBadge(value),
    },
    {
      header: 'Action',
      accessor: 'appointment_id',
      render: (value, row) => (
        <Button
          size="sm"
          variant={row.has_consultation ? 'secondary' : 'success'}
          onClick={() => navigate(`/doctor/consult/${value}`)}
          disabled={row.has_consultation || row.status === 'Cancelled'}
          style={{ borderRadius: '6px', fontWeight: '500' }}
        >
          {row.has_consultation ? 'Consulted' : 'Consult'}
        </Button>
      ),
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container fluid className="p-4">
      <Card
        style={{
          border: 'none',
          borderRadius: '15px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '5px' }}>
                <FaCalendarAlt className="me-2" />
                My Appointments
              </h4>
              <p style={{ color: '#7f8c8d', marginBottom: 0, fontSize: '0.9rem' }}>
                View and manage your appointments
              </p>
            </div>
          </div>

          {error && <Alert type="danger" message={error} />}

          {/* Filters */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="position-relative">
                <FaSearch
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#95a5a6',
                  }}
                />
                <Form.Control
                  type="text"
                  placeholder="Search by patient name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    paddingLeft: '40px',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                  }}
                />
              </div>
            </div>
            <div className="col-md-3">
              <Form.Control
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                style={{
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                }}
              />
            </div>
            <div className="col-md-3">
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setSearchTerm('');
                  setFilterDate('');
                }}
                style={{ borderRadius: '8px', width: '100%' }}
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <EmptyState
              icon={FaCalendarAlt}
              title="No Appointments Found"
              message="You don't have any appointments yet."
            />
          ) : (
            <Table columns={columns} data={filteredAppointments} />
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ViewAppointments;
