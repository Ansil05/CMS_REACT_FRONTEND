import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaCalendar } from 'react-icons/fa';
import Button from '../../elements/Button';
import SearchBar from '../../elements/SearchBar';
import Table from '../../ui/Table';
import LoadingSpinner from '../../ui/LoadingSpinner';
import EmptyState from '../../ui/EmptyState';
import Modal from '../../ui/Modal';
import Badge from '../../elements/Badge';
import { receptionistService } from '../../services/receptionistService';
import { formatDate, formatTime, filterArray } from '../../utils/validations';

const Appointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, appointment: null });

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    const filtered = filterArray(
      appointments,
      searchTerm,
      ['appointment_id', 'token_number', 'patient', 'doc_id', 'appointment_date']
    );
    setFilteredAppointments(filtered);
  }, [searchTerm, appointments]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await receptionistService.appointments.getAll();
      setAppointments(response.data);
      setFilteredAppointments(response.data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await receptionistService.appointments.delete(deleteModal.appointment.appointment_id);
      setDeleteModal({ show: false, appointment: null });
      loadAppointments();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Failed to delete appointment');
    }
  };

  const columns = [
    {
      field: 'token_number',
      header: 'Token',
      render: (value) => (
        <span className="badge badge-soft-primary" style={{ fontSize: '0.875rem' }}>
          #{value}
        </span>
      ),
    },
    {
      field: 'patient',
      header: 'Patient ID',
      render: (value) => <span className="fw-semibold">#{value}</span>,
    },
    {
      field: 'doc_id',
      header: 'Doctor ID',
      render: (value) => `Dr. #${value}`,
    },
    {
      field: 'appointment_date',
      header: 'Date',
      render: (value) => formatDate(value),
    },
    {
      field: 'appointment_time',
      header: 'Time',
      render: (value) => formatTime(value),
    },
    {
      field: 'status',
      header: 'Status',
      render: () => <Badge variant="success" soft>Scheduled</Badge>,
    },
    {
      field: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="d-flex gap-2">
          <button
            className="table-action-btn edit"
            onClick={() => navigate(`/receptionist/appointments/edit/${row.appointment_id}`)}
            title="Edit"
          >
            <FaEdit size={16} />
          </button>
          <button
            className="table-action-btn delete"
            onClick={() => setDeleteModal({ show: true, appointment: row })}
            title="Delete"
          >
            <FaTrash size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading appointments..." />;
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="fw-bold mb-1">Appointments</h2>
              <p className="text-muted mb-0">Manage patient appointments</p>
            </div>
            <Button
              variant="gradient"
              icon={<FaPlus />}
              onClick={() => navigate('/receptionist/appointments/add')}
            >
              Book Appointment
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by token, patient ID, date..."
          />
        </Col>
        <Col md={6} className="text-md-end mt-3 mt-md-0">
          <span className="text-muted">
            Showing {filteredAppointments.length} of {appointments.length} appointments
          </span>
        </Col>
      </Row>

      <Row>
        <Col>
          {filteredAppointments.length > 0 ? (
            <Table
              columns={columns}
              data={filteredAppointments}
              striped
              hover
              emptyMessage="No appointments found"
            />
          ) : (
            <EmptyState
              icon={FaCalendar}
              title="No Appointments Found"
              description={
                searchTerm
                  ? 'Try adjusting your search criteria'
                  : 'Get started by booking your first appointment'
              }
              action={
                !searchTerm && (
                  <Button
                    variant="gradient"
                    icon={<FaPlus />}
                    onClick={() => navigate('/receptionist/appointments/add')}
                  >
                    Book First Appointment
                  </Button>
                )
              }
            />
          )}
        </Col>
      </Row>

      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, appointment: null })}
        title="Delete Appointment"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ show: false, appointment: null })}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to delete appointment token{' '}
          <strong>#{deleteModal.appointment?.token_number}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </Container>
  );
};

export default Appointments;
