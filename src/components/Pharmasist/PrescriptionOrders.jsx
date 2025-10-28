import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Alert, Spinner } from 'react-bootstrap';
import { FaClipboardList, FaEye, FaFileInvoiceDollar, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../../config/apiConfig';

const PrescriptionOrders = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE}/doctor/consultations/with_prescriptions/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) throw new Error('Failed to fetch consultations');
      
      const data = await response.json();
      setConsultations(data.results || []);
    } catch (error) {
      console.error('Error:', error);
      showAlert('Failed to fetch prescription orders', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBill = async (consultationId) => {
    if (!window.confirm('Create pharmacy bill for this consultation?')) return;

    try {
      setProcessing(true);
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      
      const response = await fetch(
        `${API_BASE}/doctor/consultations/${consultationId}/create_pharmacy_bill/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      const data = await response.json();

      if (!response.ok && response.status !== 206) {
        throw new Error(data.error || 'Failed to create bill');
      }

      if (response.status === 206) {
        // Partial success - some medicines not found
        showAlert(
          `Bill created with warnings:\n${data.errors.join('\n')}`,
          'warning'
        );
      } else {
        showAlert('Bill created successfully!', 'success');
      }

      setShowDetailModal(false);
      fetchConsultations();
      
      // Navigate to bills page
      setTimeout(() => {
        navigate('/app/pharmacist/bills');
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      showAlert(error.message, 'danger');
    } finally {
      setProcessing(false);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  const openDetailModal = (consultation) => {
    setSelectedConsultation(consultation);
    setShowDetailModal(true);
  };

  if (loading) {
    return (
      <Container fluid className="p-4">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading prescription orders...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ fontWeight: '600', color: '#2c3e50' }}>
            <FaClipboardList className="me-2" style={{ color: '#3498db' }} />
            Prescription Orders
          </h2>
          <p className="text-muted mb-0">Manage medicine orders and prescriptions</p>
        </div>
      </div>

      {/* Alert */}
      {alert.show && (
        <Alert variant={alert.type} onClose={() => setAlert({ show: false, message: '', type: '' })} dismissible>
          {alert.message}
        </Alert>
      )}

      {/* Back Button */}
      <Button 
        variant="outline-secondary"
        onClick={() => navigate('/app/pharmacist')}
        className="mb-3"
        style={{ borderRadius: '8px' }}
      >
        <FaArrowLeft className="me-2" />
        Back to Dashboard
      </Button>

      {/* Consultations Table */}
      <Card style={{ border: 'none', borderRadius: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e8f4f8 100%)' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Consultation ID</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Patient Name</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Diagnosis</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Prescriptions</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {consultations.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <FaClipboardList size={48} style={{ opacity: 0.3, color: '#7f8c8d' }} />
                      <p className="mt-3 text-muted mb-0">No prescription orders found</p>
                    </td>
                  </tr>
                ) : (
                  consultations.map((consultation) => (
                    <tr key={consultation.consultation_id} style={{ transition: 'all 0.2s' }}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: '500', color: '#475569' }}>
                          #{consultation.consultation_id}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: '#2c3e50', fontWeight: '500' }}>
                            {consultation.patient_name || 'N/A'}                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: '#475569' }}>
                        {consultation.diagnosis.substring(0, 50)}...
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <Badge bg="info">{consultation.prescriptions?.length || 0} items</Badge>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: '#475569' }}>
                        {new Date(consultation.appointment?.date).toLocaleDateString('en-IN')}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div className="d-flex gap-2">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => openDetailModal(consultation)}
                            style={{ borderRadius: '6px' }}
                          >
                            <FaEye />
                          </Button>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleCreateBill(consultation.consultation_id)}
                            disabled={processing}
                            style={{ borderRadius: '6px' }}
                          >
                            <FaFileInvoiceDollar />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Modal.Title>Consultation Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedConsultation && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <p><strong>Consultation ID:</strong> #{selectedConsultation.consultation_id}</p>
                  <p><strong>Patient:</strong> {selectedConsultation.patient_name || 'N/A'}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Date:</strong> {new Date(selectedConsultation.appointment?.date).toLocaleDateString('en-IN')}</p>
                  <p><strong>Status:</strong> <Badge bg="success">Consultation Complete</Badge></p>
                </Col>
              </Row>
              
              <hr />
              
              <h5 className="mt-3 mb-2" style={{ color: '#2c3e50' }}>Symptoms</h5>
              <p style={{ background: '#f8f9fa', padding: '10px', borderRadius: '8px' }}>
                {selectedConsultation.symptoms}
              </p>
              
              <h5 className="mt-3 mb-2" style={{ color: '#2c3e50' }}>Diagnosis</h5>
              <p style={{ background: '#f8f9fa', padding: '10px', borderRadius: '8px' }}>
                {selectedConsultation.diagnosis}
              </p>
              
              {selectedConsultation.notes && (
                <>
                  <h5 className="mt-3 mb-2" style={{ color: '#2c3e50' }}>Doctor's Notes</h5>
                  <p style={{ background: '#fff3cd', padding: '10px', borderRadius: '8px', border: '1px solid #ffc107' }}>
                    {selectedConsultation.notes}
                  </p>
                </>
              )}
              
              <h5 className="mt-4 mb-3" style={{ color: '#2c3e50' }}>Prescribed Medicines</h5>
              <Table bordered hover>
                <thead style={{ background: '#f8f9fa' }}>
                  <tr>
                    <th>Medicine</th>
                    <th>Dosage</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedConsultation.prescriptions && selectedConsultation.prescriptions.length > 0 ? (
                    selectedConsultation.prescriptions.map((prescription) => (
                      <tr key={prescription.pid}>
                        <td><strong>{prescription.medicine}</strong></td>
                        <td>{prescription.dosage}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center text-muted">No prescriptions</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
          {selectedConsultation && (
            <Button 
              variant="success" 
              onClick={() => handleCreateBill(selectedConsultation.consultation_id)}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Processing...
                </>
              ) : (
                <>
                  <FaFileInvoiceDollar className="me-2" />
                  Create Bill
                </>
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PrescriptionOrders;
