import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from 'react-icons/fa';
import Button from '../../elements/Button';
import SearchBar from '../../elements/SearchBar';
import Table from '../../ui/Table';
import LoadingSpinner from '../../ui/LoadingSpinner';
import EmptyState from '../../ui/EmptyState';
import Modal from '../../ui/Modal';
import { receptionistService } from '../../services/receptionistService';
import { formatDate, calculateAge, filterArray } from '../../utils/validations';

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, patient: null });

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    const filtered = filterArray(
      patients,
      searchTerm,
      ['first_name', 'last_name', 'phone_no', 'email', 'Patient_id']
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const response = await receptionistService.patients.getAll();
      setPatients(response.data);
      setFilteredPatients(response.data);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await receptionistService.patients.delete(deleteModal.patient.Patient_id);
      setDeleteModal({ show: false, patient: null });
      loadPatients();
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert('Failed to delete patient');
    }
  };

  const columns = [
    {
      field: 'Patient_id',
      header: 'ID',
      render: (value) => <span className="fw-semibold">#{value}</span>,
    },
    {
      field: 'first_name',
      header: 'Name',
      render: (value, row) => (
        <div>
          <div className="fw-medium">{`${row.first_name} ${row.last_name}`}</div>
          <small className="text-muted">{row.email}</small>
        </div>
      ),
    },
    {
      field: 'dob',
      header: 'Age',
      render: (value) => `${calculateAge(value)} years`,
    },
    {
      field: 'gender',
      header: 'Gender',
    },
    {
      field: 'blood_group',
      header: 'Blood Group',
      render: (value) => <span className="badge badge-soft-danger">{value}</span>,
    },
    {
      field: 'phone_no',
      header: 'Phone',
    },
    {
      field: 'reg_date',
      header: 'Registered',
      render: (value) => formatDate(value),
    },
    {
      field: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="d-flex gap-2">
          <button
            className="table-action-btn view"
            onClick={() => navigate(`/receptionist/patients/view/${row.Patient_id}`)}
            title="View"
          >
            <FaEye size={16} />
          </button>
          <button
            className="table-action-btn edit"
            onClick={() => navigate(`/receptionist/patients/edit/${row.Patient_id}`)}
            title="Edit"
          >
            <FaEdit size={16} />
          </button>
          <button
            className="table-action-btn delete"
            onClick={() => setDeleteModal({ show: true, patient: row })}
            title="Delete"
          >
            <FaTrash size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading patients..." />;
  }

  return (
    <Container fluid>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="fw-bold mb-1">Patients</h2>
              <p className="text-muted mb-0">Manage patient records</p>
            </div>
            <Button
              variant="gradient"
              icon={<FaPlus />}
              onClick={() => navigate('/receptionist/patients/add')}
            >
              Add New Patient
            </Button>
          </div>
        </Col>
      </Row>

      {/* Search Bar */}
      <Row className="mb-4">
        <Col md={6}>
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, phone, email, or ID..."
          />
        </Col>
        <Col md={6} className="text-md-end mt-3 mt-md-0">
          <span className="text-muted">
            Showing {filteredPatients.length} of {patients.length} patients
          </span>
        </Col>
      </Row>

      {/* Table */}
      <Row>
        <Col>
          {filteredPatients.length > 0 ? (
            <Table
              columns={columns}
              data={filteredPatients}
              striped
              hover
              emptyMessage="No patients found"
            />
          ) : (
            <EmptyState
              title="No Patients Found"
              description={
                searchTerm
                  ? 'Try adjusting your search criteria'
                  : 'Get started by adding your first patient'
              }
              action={
                !searchTerm && (
                  <Button
                    variant="gradient"
                    icon={<FaPlus />}
                    onClick={() => navigate('/receptionist/patients/add')}
                  >
                    Add First Patient
                  </Button>
                )
              }
            />
          )}
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, patient: null })}
        title="Delete Patient"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ show: false, patient: null })}
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
          Are you sure you want to delete patient{' '}
          <strong>
            {deleteModal.patient?.first_name} {deleteModal.patient?.last_name}
          </strong>
          ? This action cannot be undone.
        </p>
      </Modal>
    </Container>
  );
};

export default Patients;
