import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Alert, Spinner } from 'react-bootstrap';
import { FaStethoscope, FaEye, FaFileInvoiceDollar, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../../config/apiConfig';

const ConsultationList = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [dispensing, setDispensing] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/doctor/consultations/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) throw new Error('Failed to fetch consultations');
      
      const data = await response.json();
      // Filter consultations with pending prescriptions
      const withPendingPrescriptions = (data.results || data).filter(
        c => c.prescriptions && c.prescriptions.some(p => p.status === 'PENDING')
      );
      setConsultations(withPendingPrescriptions);
    } catch (error) {
      console.error('Error:', error);
      showAlert('Failed to fetch consultations', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleDispense = async (consultationId) => {
    if (!window.confirm('Dispense all prescriptions and create bill?')) return;

    try {
      setDispensing(true);
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE}/doctor/consultations/${consultationId}/dispense_prescriptions/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.unavailable_items) {
          const itemsList = data.unavailable_items.map(item => 
            `${item.medicine}: Required ${item.required}, Available ${item.available}`
          ).join('\n');
          throw new Error(`Insufficient stock:\n${itemsList}`);
        }
        throw new Error(data.error || 'Failed to dispense prescriptions');
      }

      showAlert('Prescriptions dispensed and bill created successfully!', 'success');
      setShowDetailModal(false);
      fetchConsultations();
    } catch (error) {
      console.error('Error:', error);
      showAlert(error.message, 'danger');
    } finally {
      setDispensing(false);
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

  const getPendingCount = (consultation) => {
    return consultation.prescriptions.filter(p => p.status === 'PENDING').length;
  };

  if (loading) {
    return (
      <Container fluid className="p-4">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading consultations...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ fontWeight: '600', color: '#2c3e50' }}>
            <FaStethoscope className="me-2" style={{ color: '#3498db' }} />
            Consultations with Pending Prescriptions
          </h2>
          <p className="text-muted mb-0">Dispense prescriptions and create bills</p>
        </div>
      </div>

      {alert.show && (
        <Alert variant={alert.type} onClose={() => setAlert({ show: false, message: '', type: '' })} dismissible>
          {alert.message}
        </Alert>
      )}

      <Button 
        variant="outline-secondary"
        onClick={() => navigate('/app/pharmacist')}
        className="mb-3"
        style={{ borderRadius: '8px' }}
      >
        <FaArrowLeft className="me-2" />
        Back to Dashboard
      </Button>

      <Card style={{ border: 'none', borderRadius: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e8f4f8 100%)' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Consultation ID</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Patient</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Doctor</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Diagnosis</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Pending Items</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Total Cost</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {consultations.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <FaStethoscope size={48} style={{ opacity: 0.3, color: '#7f8c8d' }} />
                      <p className="mt-3 text-muted mb-0">No consultations with pending prescriptions</p>
                    </td>
                  </tr>
                ) : (
                  consultations.map((consultation) => (
                    <tr key={consultation.consultation_id}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: '500' }}>
                          #{consultation.consultation_id}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>
                        {consultation.patient_name}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        {consultation.doctor_name}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        {consultation.diagnosis.substring(0, 40)}...
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        {new Date(consultation.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <Badge bg="warning" text="dark">{getPendingCount(consultation)}</Badge>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#27ae60' }}>
                        ₹{parseFloat(consultation.total_prescription_cost).toFixed(2)}
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
                            onClick={() => handleDispense(consultation.consultation_id)}
                            disabled={dispensing}
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
                  <p><strong>Patient:</strong> {selectedConsultation.patient_name}</p>
                  <p><strong>Doctor:</strong> {selectedConsultation.doctor_name}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Date:</strong> {new Date(selectedConsultation.created_at).toLocaleDateString('en-IN')}</p>
                  <p><strong>Status:</strong> <Badge bg="info">Consultation Complete</Badge></p>
                </Col>
              </Row>
              
              <hr />
              
              <h5 className="mt-3">Symptoms</h5>
              <p style={{ background: '#f8f9fa', padding: '10px', borderRadius: '8px' }}>
                {selectedConsultation.symptoms}
              </p>
              
              <h5 className="mt-3">Diagnosis</h5>
              <p style={{ background: '#f8f9fa', padding: '10px', borderRadius: '8px' }}>
                {selectedConsultation.diagnosis}
              </p>
              
              {selectedConsultation.notes && (
                <>
                  <h5 className="mt-3">Doctor's Notes</h5>
                  <p style={{ background: '#fff3cd', padding: '10px', borderRadius: '8px' }}>
                    {selectedConsultation.notes}
                  </p>
                </>
              )}
              
              <h5 className="mt-4">Prescribed Medicines</h5>
              <Table bordered hover>
                <thead style={{ background: '#f8f9fa' }}>
                  <tr>
                    <th>Medicine</th>
                    <th>Dosage</th>
                    <th>Frequency</th>
                    <th>Duration</th>
                    <th>Qty</th>
                    <th>Status</th>
                    <th>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedConsultation.prescriptions.map((prescription) => (
                    <tr key={prescription.pid}>
                      <td>
                        <strong>{prescription.medicine_name}</strong>
                        {prescription.instructions && (
                          <><br /><small className="text-muted">{prescription.instructions}</small></>
                        )}
                      </td>
                      <td>{prescription.dosage}</td>
                      <td>{prescription.frequency}</td>
                      <td>{prescription.duration}</td>
                      <td>{prescription.quantity}</td>
                      <td>
                        <Badge bg={prescription.status === 'PENDING' ? 'warning' : 'success'}>
                          {prescription.status}
                        </Badge>
                      </td>
                      <td><strong>₹{parseFloat(prescription.total_cost).toFixed(2)}</strong></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot style={{ background: '#f8f9fa' }}>
                  <tr>
                    <td colSpan="6" className="text-end"><strong>Total Amount:</strong></td>
                    <td><strong style={{ color: '#27ae60', fontSize: '1.1em' }}>
                      ₹{parseFloat(selectedConsultation.total_prescription_cost).toFixed(2)}
                    </strong></td>
                  </tr>
                </tfoot>
              </Table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
          {selectedConsultation && getPendingCount(selectedConsultation) > 0 && (
            <Button 
              variant="success" 
              onClick={() => handleDispense(selectedConsultation.consultation_id)}
              disabled={dispensing}
            >
              {dispensing ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Dispensing...
                </>
              ) : (
                <>
                  <FaFileInvoiceDollar className="me-2" />
                  Dispense All & Create Bill
                </>
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ConsultationList;
