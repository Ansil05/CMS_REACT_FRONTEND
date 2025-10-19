import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import Button from '../../elements/Button';
import Select from '../../elements/Select';
import DatePicker from '../../elements/DatePicker';
import Alert from '../../ui/Alert';
import { receptionistService } from '../../services/receptionistService';
import { validateRequired } from '../../utils/validations';

const AddAppointment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patient: '',
    doc_id: '',
    appointment_date: '',
    appointment_time: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadPatients();
    loadDoctors();
  }, []);

  const loadPatients = async () => {
    try {
      const response = await receptionistService.patients.getAll();
      setPatients(response.data);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  const loadDoctors = async () => {
    try {
      // Assuming you have a doctor service
      const response = await receptionistService.doctors?.getAll() || { data: [] };
      setDoctors(response.data);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    setError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.patient)) {
      newErrors.patient = 'Please select a patient';
    }
    if (!validateRequired(formData.doc_id)) {
      newErrors.doc_id = 'Please select a doctor';
    }
    if (!validateRequired(formData.appointment_date)) {
      newErrors.appointment_date = 'Appointment date is required';
    }
    if (!validateRequired(formData.appointment_time)) {
      newErrors.appointment_time = 'Appointment time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix all errors before submitting');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await receptionistService.appointments.create(formData);
      setSuccess('Appointment booked successfully!');
      setTimeout(() => {
        navigate('/receptionist/appointments');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center gap-3">
            <Button
              variant="secondary"
              icon={<FaArrowLeft />}
              onClick={() => navigate('/receptionist/appointments')}
            >
              Back
            </Button>
            <div>
              <h2 className="fw-bold mb-1">Book Appointment</h2>
              <p className="text-muted mb-0">Schedule a new appointment</p>
            </div>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Card className="border-0 shadow-sm" style={{ borderRadius: 'var(--radius-lg)' }}>
        <Card.Body className="p-4">
          <form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Select
                  label="Patient"
                  name="patient"
                  value={formData.patient}
                  onChange={handleChange}
                  error={errors.patient}
                  required
                  options={patients.map(p => ({
                    value: p.Patient_id,
                    label: `${p.first_name} ${p.last_name} (ID: ${p.Patient_id})`
                  }))}
                  placeholder="Select patient"
                />
              </Col>
              <Col md={6}>
                <Select
                  label="Doctor"
                  name="doc_id"
                  value={formData.doc_id}
                  onChange={handleChange}
                  error={errors.doc_id}
                  required
                  options={doctors.map(d => ({
                    value: d.id,
                    label: `Dr. ${d.name} - ${d.specialization}`
                  }))}
                  placeholder="Select doctor"
                />
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <DatePicker
                  label="Appointment Date"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleChange}
                  error={errors.appointment_date}
                  required
                />
              </Col>
              <Col md={6}>
                <div className="form-group">
                  <label className="form-label form-label-required">Appointment Time</label>
                  <input
                    type="time"
                    name="appointment_time"
                    className={`form-control ${errors.appointment_time ? 'is-invalid' : ''}`}
                    value={formData.appointment_time}
                    onChange={handleChange}
                  />
                  {errors.appointment_time && (
                    <div className="invalid-feedback">{errors.appointment_time}</div>
                  )}
                </div>
              </Col>
            </Row>

            <div className="form-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/receptionist/appointments')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient"
                icon={<FaSave />}
                loading={loading}
              >
                Book Appointment
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddAppointment;
