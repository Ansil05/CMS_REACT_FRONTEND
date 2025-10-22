import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUser, FaSave, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import {
  getAppointmentForConsultation,
  createConsultation,
} from '../../services/doctorService';
import LoadingSpinner from '../../ui/LoadingSpinner';
import Alert from '../../ui/Alert';

const ConsultPatient = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [appointment, setAppointment] = useState(null);

  const [formData, setFormData] = useState({
    symptoms: '',
    notes: '',
    diagnosis: '',
    prescriptions: [{ medicine: '', dosage: '' }],
    lab_prescriptions: [{ testname: '' }],
  });

  useEffect(() => {
    fetchAppointmentDetails();
  }, [appointmentId]);

  const fetchAppointmentDetails = async () => {
    try {
      setLoading(true);
      const data = await getAppointmentForConsultation(appointmentId);
      setAppointment(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch appointment details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePrescriptionChange = (index, field, value) => {
    const updatedPrescriptions = [...formData.prescriptions];
    updatedPrescriptions[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      prescriptions: updatedPrescriptions,
    }));
  };

  const addPrescription = () => {
    setFormData((prev) => ({
      ...prev,
      prescriptions: [...prev.prescriptions, { medicine: '', dosage: '' }],
    }));
  };

  const removePrescription = (index) => {
    setFormData((prev) => ({
      ...prev,
      prescriptions: prev.prescriptions.filter((_, i) => i !== index),
    }));
  };

  const handleLabPrescriptionChange = (index, value) => {
    const updatedLabPrescriptions = [...formData.lab_prescriptions];
    updatedLabPrescriptions[index].testname = value;
    setFormData((prev) => ({
      ...prev,
      lab_prescriptions: updatedLabPrescriptions,
    }));
  };

  const addLabPrescription = () => {
    setFormData((prev) => ({
      ...prev,
      lab_prescriptions: [...prev.lab_prescriptions, { testname: '' }],
    }));
  };

  const removeLabPrescription = (index) => {
    setFormData((prev) => ({
      ...prev,
      lab_prescriptions: prev.lab_prescriptions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.symptoms.trim() || !formData.diagnosis.trim()) {
      setError('Symptoms and Diagnosis are required');
      return;
    }

    const validPrescriptions = formData.prescriptions.filter(
      (p) => p.medicine.trim() && p.dosage.trim()
    );
    const validLabPrescriptions = formData.lab_prescriptions.filter(
      (lp) => lp.testname.trim()
    );

    try {
      setSubmitting(true);
      setError(null);

      const consultationData = {
        appointment: appointmentId,
        symptoms: formData.symptoms,
        notes: formData.notes,
        diagnosis: formData.diagnosis,
        prescriptions: validPrescriptions,
        lab_prescriptions: validLabPrescriptions,
      };

      await createConsultation(consultationData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/doctor/consultations');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create consultation');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!appointment) {
    return (
      <Container className="p-4">
        <Alert type="danger" message="Appointment not found" />
      </Container>
    );
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
            <h4 style={{ fontWeight: '600', color: '#2c3e50' }}>
              <FaUser className="me-2" />
              Patient Consultation
            </h4>
            <Button
              variant="outline-secondary"
              onClick={() => navigate('/doctor/appointments')}
              style={{ borderRadius: '8px' }}
            >
              <FaTimes className="me-2" />
              Cancel
            </Button>
          </div>

          {error && <Alert type="danger" message={error} />}
          {success && (
            <Alert type="success" message="Consultation created successfully!" />
          )}

          {/* Patient Info */}
          <Card className="mb-4" style={{ background: '#f8f9fa', border: 'none' }}>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <strong>Patient Name:</strong>
                  <p className="mb-0">{appointment.patient_name}</p>
                </Col>
                <Col md={2}>
                  <strong>Age:</strong>
                  <p className="mb-0">{appointment.patient_age} years</p>
                </Col>
                <Col md={3}>
                  <strong>Phone:</strong>
                  <p className="mb-0">{appointment.patient_phone}</p>
                </Col>
                <Col md={3}>
                  <strong>Appointment Date:</strong>
                  <p className="mb-0">{appointment.date}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Form onSubmit={handleSubmit}>
            {/* Symptoms */}
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '500' }}>
                Symptoms <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="symptoms"
                value={formData.symptoms}
                onChange={handleInputChange}
                placeholder="Enter patient symptoms..."
                required
                style={{ borderRadius: '8px' }}
              />
            </Form.Group>

            {/* Notes */}
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '500' }}>Notes (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Additional notes..."
                style={{ borderRadius: '8px' }}
              />
            </Form.Group>

            {/* Diagnosis */}
            <Form.Group className="mb-4">
              <Form.Label style={{ fontWeight: '500' }}>
                Diagnosis <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleInputChange}
                placeholder="Enter diagnosis..."
                required
                style={{ borderRadius: '8px' }}
              />
            </Form.Group>

            {/* Prescriptions */}
            <Card className="mb-4" style={{ border: '1px solid #e0e0e0' }}>
              <Card.Header style={{ background: '#f8f9fa', fontWeight: '500' }}>
                Medicine Prescriptions
              </Card.Header>
              <Card.Body>
                {formData.prescriptions.map((prescription, index) => (
                  <Row key={index} className="mb-3 align-items-end">
                    <Col md={5}>
                      <Form.Group>
                        <Form.Label style={{ fontSize: '0.9rem' }}>
                          Medicine Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={prescription.medicine}
                          onChange={(e) =>
                            handlePrescriptionChange(index, 'medicine', e.target.value)
                          }
                          placeholder="Medicine name"
                          style={{ borderRadius: '8px' }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={5}>
                      <Form.Group>
                        <Form.Label style={{ fontSize: '0.9rem' }}>Dosage</Form.Label>
                        <Form.Control
                          type="text"
                          value={prescription.dosage}
                          onChange={(e) =>
                            handlePrescriptionChange(index, 'dosage', e.target.value)
                          }
                          placeholder="e.g., 1-0-1 after food"
                          style={{ borderRadius: '8px' }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      {formData.prescriptions.length > 1 && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removePrescription(index)}
                          style={{ width: '100%', borderRadius: '8px' }}
                        >
                          <FaTrash />
                        </Button>
                      )}
                    </Col>
                  </Row>
                ))}
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={addPrescription}
                  style={{ borderRadius: '8px' }}
                >
                  <FaPlus className="me-2" />
                  Add Medicine
                </Button>
              </Card.Body>
            </Card>

            {/* Lab Prescriptions */}
            <Card className="mb-4" style={{ border: '1px solid #e0e0e0' }}>
              <Card.Header style={{ background: '#f8f9fa', fontWeight: '500' }}>
                Lab Test Prescriptions
              </Card.Header>
              <Card.Body>
                {formData.lab_prescriptions.map((labPrescription, index) => (
                  <Row key={index} className="mb-3 align-items-end">
                    <Col md={10}>
                      <Form.Group>
                        <Form.Label style={{ fontSize: '0.9rem' }}>
                          Test Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={labPrescription.testname}
                          onChange={(e) =>
                            handleLabPrescriptionChange(index, e.target.value)
                          }
                          placeholder="Lab test name"
                          style={{ borderRadius: '8px' }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      {formData.lab_prescriptions.length > 1 && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeLabPrescription(index)}
                          style={{ width: '100%', borderRadius: '8px' }}
                        >
                          <FaTrash />
                        </Button>
                      )}
                    </Col>
                  </Row>
                ))}
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={addLabPrescription}
                  style={{ borderRadius: '8px' }}
                >
                  <FaPlus className="me-2" />
                  Add Lab Test
                </Button>
              </Card.Body>
            </Card>

            {/* Submit Button */}
            <div className="d-flex gap-3">
              <Button
                type="submit"
                variant="success"
                disabled={submitting}
                style={{
                  borderRadius: '8px',
                  padding: '10px 30px',
                  fontWeight: '500',
                }}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" />
                    Save Consultation
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => navigate('/doctor/appointments')}
                style={{ borderRadius: '8px', padding: '10px 30px' }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ConsultPatient;
