import { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Modal, Spinner, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from "react-icons/fa";
import { receptionistService } from "../../services/receptionistService";
import { calculateAge } from "../../utils/validations"; // keep this helper if available

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch patients on load
  useEffect(() => {
    loadPatients();
  }, []);

  // Filter patients on search
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = patients.filter((p) =>
      [p.first_name, p.last_name, p.email, p.phone_no, p.Patient_id.toString()]
        .join(" ")
        .toLowerCase()
        .includes(lowerSearch)
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const response = await receptionistService.patients.getAll();
      setPatients(response.data || []);
      setFilteredPatients(response.data || []);
    } catch (err) {
      console.error("Error loading patients:", err);
      setError("Failed to load patients.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await receptionistService.patients.delete(selectedPatient.Patient_id);
      setShowDeleteModal(false);
      setSuccess("Patient deleted successfully!");
      loadPatients();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error deleting patient:", err);
      setError("Failed to delete patient.");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h2 className="mb-1">Patients Management</h2>
          <p className="text-muted">Manage patient records</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => navigate("/app/receptionist/patients/add")}>
            <FaPlus className="me-2" /> Add New Patient
          </Button>
        </Col>
      </Row>

      {/* Alerts */}
      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" onClose={() => setSuccess("")} dismissible>
          {success}
        </Alert>
      )}

      {/* Search bar */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search by name, phone, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>

      {/* Loading Spinner */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading patients...</p>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <FaSearch size={40} className="mb-3" />
          <p className="mb-1">{searchTerm ? "No patients found" : "No patients registered yet"}</p>
          <small>
            {searchTerm
              ? "Try adjusting your search."
              : 'Click "Add New Patient" to register a patient.'}
          </small>
        </div>
      ) : (
        /* Patients Table */
        <Table striped hover responsive>
          <thead className="table-light">
            <tr>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Blood Group</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.Patient_id}>
                <td><strong>#{patient.Patient_id}</strong></td>
                <td>{patient.first_name} {patient.last_name}</td>
                <td>{calculateAge(patient.dob)} years</td>
                <td>{patient.gender}</td>
                <td>{patient.blood_group}</td>
                <td>{patient.phone_no}</td>
                <td>{patient.email}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant="outline-info"
                      onClick={() => navigate(`/app/receptionist/patients/view/${patient.Patient_id}`)}
                    >
                      <FaEye />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => navigate(`/app/receptionist/patients/edit/${patient.Patient_id}`)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => {
                        setSelectedPatient(patient);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Patient</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>
            {selectedPatient?.first_name} {selectedPatient?.last_name}
          </strong>
          ? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Patients;
