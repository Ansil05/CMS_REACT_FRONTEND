import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Modal, Row, Col } from 'react-bootstrap';
import { FaEye, FaTrash, FaFileAlt } from 'react-icons/fa';
import { getConsultations, deleteConsultation } from '../../services/doctorService';
import Table from '../../ui/Table';
import LoadingSpinner from '../../ui/LoadingSpinner';
import EmptyState from '../../ui/EmptyState';
import Alert from '../../ui/Alert';
import ConfirmModal from '../../ui/ConfirmModal';

const ConsultationHistory = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const data = await getConsultations();
      setConsultations(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch consultations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (consultation) => {
    setSelectedConsultation(consultation);
    setShowDetailModal(true);
  };

  const handleDeleteClick = (consultationId) => {
    setDeletingId(consultationId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteConsultation(deletingId);
      setSuccess('Consultation deleted successfully');
      fetchConsultations();
      setShowDeleteModal(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to delete consultation');
      console.error(err);
    }
  };

  const columns = [
    {
      header: 'Consultation ID',
      accessor: 'consultation_id',
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
      header: 'Date',
      accessor: 'appointment_date',
    },
    {
      header: 'Diagnosis',
      accessor: 'diagnosis',
      render: (value) => (
        <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value}
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: 'consultation_id',
      render: (value, row) => (
        <div className="d-flex gap-2">
          <Button
            size="sm"
            variant="info"
            onClick={() => handleViewDetails(row)}
            style={{ borderRadius: '6px' }}
          >
            <FaEye />
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDeleteClick(value)}
            style={{ borderRadius: '6px' }}
          >
            <FaTrash />
          </Button>
        </div>
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
                <FaFileAlt className="me-2" />
                Consultation History
              </h4>
              <p style={{ color: '#7f8c8d', marginBottom: 0, fontSize: '0.9rem' }}>
                View your previous patient consultations
              </p>
            </div>
          </div>

          {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

          {consultations.length === 0 ? (
            <EmptyState
              icon={FaFileAlt}
              title="No Consultations Found"
              message="You haven't completed any consultations yet."
            />
          ) : (
            <Table columns={columns} data={consultations} />
          )}
        </Card.Body>
      </Card>

      {/* Detail Modal */}
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Consultation Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedConsultation && (
            <>
              <Card className="mb-3" style={{ background: '#f8f9fa', border: 'none' }}>
                <Card.Body>
                  <h6 className="mb-3" style={{ fontWeight: '600' }}>
                    Patient Information
                  </h6>
                  <Row>
                    <Col md={6}>
                      <p>
                        <strong>Name:</strong> {selectedConsultation.patient_name}
                      </p>
                      <p>
                        <strong>Age:</strong> {selectedConsultation.patient_age} years
                      </p>
                    </Col>
                    <Col md={6}>
                      <p>
                        <strong>Phone:</strong> {selectedConsultation.patient_phone}
                      </p>
                      <p>
                        <strong>Date:</strong> {selectedConsultation.appointment_date}
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <h6 className="mb-2" style={{ fontWeight: '600' }}>
                Symptoms
              </h6>
              <p className="mb-3" style={{ whiteSpace: 'pre-wrap' }}>
                {selectedConsultation.symptoms}
              </p>

              {selectedConsultation.notes && (
                <>
                  <h6 className="mb-2" style={{ fontWeight: '600' }}>
                    Notes
                  </h6>
                  <p className="mb-3" style={{ whiteSpace: 'pre-wrap' }}>
                    {selectedConsultation.notes}
                  </p>
                </>
              )}

              <h6 className="mb-2" style={{ fontWeight: '600' }}>
                Diagnosis
              </h6>
              <p className="mb-3" style={{ whiteSpace: 'pre-wrap' }}>
                {selectedConsultation.diagnosis}
              </p>

              {selectedConsultation.prescriptions.length > 0 && (
                <>
                  <h6 className="mb-2" style={{ fontWeight: '600' }}>
                    Prescriptions
                  </h6>
                  <ul>
                    {selectedConsultation.prescriptions.map((prescription) => (
                      <li key={prescription.pid}>
                        <strong>{prescription.medicine}</strong> - {prescription.dosage}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {selectedConsultation.lab_prescriptions.length > 0 && (
                <>
                  <h6 className="mb-2" style={{ fontWeight: '600' }}>
                    Lab Tests
                  </h6>
                  <ul>
                    {selectedConsultation.lab_prescriptions.map((labTest) => (
                      <li key={labTest.lab_pid}>{labTest.testname}</li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Consultation"
        message="Are you sure you want to delete this consultation? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
      />
    </Container>
  );
};

export default ConsultationHistory;
