import { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaSave, FaTimes } from 'react-icons/fa';
import Button from '../../elements/Button';
import Select from '../../elements/Select';
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
      // Mock doctors - replace with actual API call
      setDoctors([
        { id: 1, name: 'Dr. Smith', specialization: 'Cardiologist' },
        { id: 2, name: 'Dr. Johnson', specialization: 'Pediatrician' },
        { id: 3, name: 'Dr. Williams', specialization: 'Orthopedic' },
      ]);
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
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
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
          </Row>

          <Row>
            <Col md={12}>
              <Select
                label="Doctor"
                name="doc_id"
                value={formData.doc_id}
                onChange={handleChange}
                error={errors.doc_id}
                required
                options={doctors.map(d => ({
                  value: d.id,
                  label: `${d.name} - ${d.specialization}`
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

          <div className="d-flex gap-2 justify-content-end mt-4">
            {onCancel && (
              <Button
                type="button"
                variant="secondary"
                icon={<FaTimes />}
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="gradient"
              icon={<FaSave />}
              loading={loading}
            >
              {initialData ? 'Update Appointment' : 'Book Appointment'}
            </Button>
          </div>
        </form>
      </Card.Body>
    </Card>
  );
};

export default AppointmentBookingForm;
