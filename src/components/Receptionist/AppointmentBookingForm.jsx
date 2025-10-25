import { useState, useEffect } from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import { FaSave, FaTimes } from 'react-icons/fa';
import Button from '../../elements/Button';
import DatePicker from '../../elements/DatePicker';
import Input from '../../elements/Input';
import Alert from '../../ui/Alert';
import { receptionistService } from '../../services/receptionistService';
import { validateRequired } from '../../utils/validations';

const AppointmentBookingForm = ({ onSuccess, onCancel, initialData = null }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patient: initialData?.patient || '',
    doc_id: initialData?.doc_id || '',
    appointment_date: initialData?.appointment_date || '',
    appointment_time: initialData?.appointment_time || '',
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
      const response = await receptionistService.doctors.getAll();
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

    if (!validateRequired(formData.patient)) newErrors.patient = 'Please select a patient';
    if (!validateRequired(formData.doc_id)) newErrors.doc_id = 'Please select a doctor';
    if (!validateRequired(formData.appointment_date)) newErrors.appointment_date = 'Appointment date is required';
    if (!validateRequired(formData.appointment_time)) newErrors.appointment_time = 'Appointment time is required';

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
      
      if (initialData) {
        await receptionistService.appointments.update(initialData.appointment_id, formData);
      } else {
        await receptionistService.appointments.create(formData);
      }
      
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm" style={{ borderRadius: 'var(--radius-lg)' }}>
      <Card.Body className="p-4">
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Patient <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="patient"
                  value={formData.patient}
                  onChange={handleChange}
                  isInvalid={!!errors.patient}
                  style={{ height: '42px', fontSize: '15px' }}
                >
                  <option value="">Select Patient</option>
                  {patients.map(p => (
                    <option key={p.Patient_id} value={p.Patient_id}>
                      {p.first_name} {p.last_name} (ID: {p.Patient_id})
                    </option>
                  ))}
                </Form.Select>
                {errors.patient && <div className="invalid-feedback d-block">{errors.patient}</div>}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Doctor <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="doc_id"
                  value={formData.doc_id}
                  onChange={handleChange}
                  isInvalid={!!errors.doc_id}
                  style={{ height: '42px', fontSize: '15px' }}
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((d) => (
                    <option key={d.Id} value={d.Staff?.StaffId}>
                      Dr. {d.Staff?.FirstName} - {d.Specialization?.SpecializationName}
                    </option>
                  ))}
                </Form.Select>
                {errors.doc_id && <div className="invalid-feedback d-block">{errors.doc_id}</div>}
              </Form.Group>
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
                min={new Date().toISOString().split('T')[0]}
              />
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Appointment Time <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="time"
                  name="appointment_time"
                  value={formData.appointment_time}
                  onChange={handleChange}
                  isInvalid={!!errors.appointment_time}
                  style={{ height: '42px' }}
                />
                {errors.appointment_time && <div className="invalid-feedback d-block">{errors.appointment_time}</div>}
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-2 justify-content-end mt-4">
            {onCancel && (
              <Button type="button" variant="secondary" icon={<FaTimes />} onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" variant="gradient" icon={<FaSave />} loading={loading}>
              {initialData ? 'Update Appointment' : 'Book Appointment'}
            </Button>
          </div>
        </form>
      </Card.Body>
    </Card>
  );
};

export default AppointmentBookingForm;
