import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Alert } from 'react-bootstrap';
import { FaPrescriptionBottle, FaEye, FaFileInvoiceDollar } from 'react-icons/fa';
import { API_BASE } from '../../config/apiConfig';

const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/doctor/prescriptions/pending/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) throw new Error('Failed to fetch prescriptions');
      
      const data = await response.json();
      setPrescriptions(data.results || []);
    } catch (error) {
      console.error('Error:', error);
      showAlert('Failed to fetch prescriptions', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleDispense = async (prescriptionId) => {
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE}/doctor/prescriptions/${prescriptionId}/dispense/`,
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
        throw new Error(data.error || 'Failed to dispense prescription');
      }

      showAlert('Prescription dispensed and bill created successfully!', 'success');
      setShowDetailModal(false);
      fetchPrescriptions();
    } catch (error) {
      console.error('Error:', error);
      showAlert(error.message, 'danger');
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  const openDetailModal = (prescription) => {
    setSelectedPrescription(prescription);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      'PENDING': <Badge bg="warning">Pending</Badge>,
      'DISPENSED': <Badge bg="success">Dispensed</Badge>,
      'CANCELLED': <Badge bg="danger">Cancelled</Badge>,
      'EXPIRED': <Badge bg="secondary">Expired</Badge>
    };
    return badges[status] || <Badge bg="secondary">{status}</Badge>;
  };

  if (loading) {
    return (
      <Container className="p-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      <h2 className="mb-4">
        <FaPrescriptionBottle className="me-2" />
        Pending Prescriptions
      </h2>

      {alert.show && (
        <Alert variant={alert.type} onClose={() => setAlert({ show: false, message: '', type: '' })} dismissible>
          {alert.message}
        </Alert>
      )}

      <Card>
        <Card.Body className="p-0">
          <Table hover responsive>
            <thead>
              <tr>
                <th>Prescription #</th>
                <th>Patient Name</th>
                <th>Doctor</th>
                <th>Diagnosis</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    No pending prescriptions
                  </td>
                </tr>
              ) : (
                prescriptions.map((prescription) => (
                  <tr key={prescription.prescription_id}>
                    <td><strong>{prescription.serial_number}</strong></td>
                    <td>{prescription.patient_name}</td>
                    <td>{prescription.doctor_name}</td>
                    <td>{prescription.diagnosis.substring(0, 50)}...</td>
                    <td>{new Date(prescription.prescription_date).toLocaleDateString()}</td>
                    <td>{prescription.total_items}</td>
                    <td>₹{parseFloat(prescription.total_amount).toFixed(2)}</td>
                    <td>{getStatusBadge(prescription.status)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => openDetailModal(prescription)}
                        >
                          <FaEye /> View
                        </Button>
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleDispense(prescription.prescription_id)}
                        >
                          <FaFileInvoiceDollar /> Dispense
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Prescription Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Prescription Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPrescription && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <p><strong>Prescription #:</strong> {selectedPrescription.serial_number}</p>
                  <p><strong>Patient:</strong> {selectedPrescription.patient_name}</p>
                  <p><strong>Doctor:</strong> {selectedPrescription.doctor_name}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Date:</strong> {new Date(selectedPrescription.prescription_date).toLocaleDateString()}</p>
                  <p><strong>Valid Until:</strong> {new Date(selectedPrescription.valid_until).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {getStatusBadge(selectedPrescription.status)}</p>
                </Col>
              </Row>
              
              <h5>Diagnosis</h5>
              <p>{selectedPrescription.diagnosis}</p>
              
              <h5 className="mt-3">Prescribed Medicines</h5>
              <Table bordered>
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Dosage</th>
                    <th>Frequency</th>
                    <th>Duration</th>
                    <th>Quantity</th>
                    <th>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPrescription.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.medicine_name}</td>
                      <td>{item.dosage}</td>
                      <td>{item.frequency}</td>
                      <td>{item.duration}</td>
                      <td>{item.quantity}</td>
                      <td>₹{parseFloat(item.total_cost).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="5" className="text-end"><strong>Total:</strong></td>
                    <td><strong>₹{parseFloat(selectedPrescription.total_amount).toFixed(2)}</strong></td>
                  </tr>
                </tfoot>
              </Table>
              
              {selectedPrescription.instructions && (
                <>
                  <h5 className="mt-3">Instructions</h5>
                  <p>{selectedPrescription.instructions}</p>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
          {selectedPrescription && selectedPrescription.status === 'PENDING' && (
            <Button 
              variant="success" 
              onClick={() => handleDispense(selectedPrescription.prescription_id)}
            >
              <FaFileInvoiceDollar /> Dispense & Create Bill
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PrescriptionList;
