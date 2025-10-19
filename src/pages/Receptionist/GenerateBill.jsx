import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import Button from '../../elements/Button';
import Select from '../../elements/Select';
import Input from '../../elements/Input';
import Alert from '../../ui/Alert';
import { receptionistService } from '../../services/receptionistService';
import { validateRequired, validatePositiveNumber } from '../../utils/validations';

const GenerateBill = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    patient: '',
    appointment: '',
    reg_fee: '',
    doc_fee: '',
  });
  const [errors, setErrors] = useState({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadPatients();
    loadAppointments();
  }, []);

  useEffect(() => {
    const regFee = parseFloat(formData.reg_fee) || 0;
    const docFee = parseFloat(formData.doc_fee) || 0;
    setTotal(regFee + docFee);
  }, [formData.reg_fee, formData.doc_fee]);

  const loadPatients = async () => {
    try {
      const response = await receptionistService.patients.getAll();
      setPatients(response.data);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  const loadAppointments = async () => {
    try {
      const response = await receptionistService.appointments.getAll();
      setAppointments(response.data);
    } catch (error) {
      console.error('Error loading appointments:', error);
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
    if (!validateRequired(formData.appointment)) {
      newErrors.appointment = 'Please select an appointment';
    }
    if (!validateRequired(formData.reg_fee)) {
      newErrors.reg_fee = 'Registration fee is required';
    } else if (!validatePositiveNumber(formData.reg_fee)) {
      newErrors.reg_fee = 'Must be a positive number';
    }
    if (!validateRequired(formData.doc_fee)) {
      newErrors.doc_fee = 'Consultation fee is required';
    } else if (!validatePositiveNumber(formData.doc_fee)) {
      newErrors.doc_fee = 'Must be a positive number';
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
      
      const billData = {
        ...formData,
        total: total.toFixed(2),
      };
      
      const response = await receptionistService.bills.create(billData);
      setSuccess('Bill generated successfully!');
      setTimeout(() => {
        navigate(`/receptionist/billing/view/${response.data.bill_id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate bill');
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
              onClick={() => navigate('/receptionist/billing')}
            >
              Back
            </Button>
            <div>
              <h2 className="fw-bold mb-1">Generate Bill</h2>
              <p className="text-muted mb-0">Create a new billing record</p>
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
                  label="Appointment"
                  name="appointment"
                  value={formData.appointment}
                  onChange={handleChange}
                  error={errors.appointment}
                  required
                  options={appointments.map(a => ({
                    value: a.appointment_id,
                    label: `Token #${a.token_number} - ${a.appointment_date}`
                  }))}
                  placeholder="Select appointment"
                />
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Input
                  label="Registration Fee"
                  name="reg_fee"
                  type="number"
                  step="0.01"
                  value={formData.reg_fee}
                  onChange={handleChange}
                  error={errors.reg_fee}
                  required
                  placeholder="Enter registration fee"
                />
              </Col>
              <Col md={6}>
                <Input
                  label="Consultation Fee"
                  name="doc_fee"
                  type="number"
                  step="0.01"
                  value={formData.doc_fee}
                  onChange={handleChange}
                  error={errors.doc_fee}
                  required
                  placeholder="Enter consultation fee"
                />
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <div 
                  className="p-4 mb-4"
                  style={{
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-lg)',
                    border: '2px dashed var(--primary-300)'
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-semibold mb-0">Total Amount:</h5>
                    <h3 className="fw-bold mb-0" style={{ color: 'var(--primary-600)' }}>
                      ₹{total.toFixed(2)}
                    </h3>
                  </div>
                </div>
              </Col>
            </Row>

            <div className="form-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/receptionist/billing')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient"
                icon={<FaSave />}
                loading={loading}
              >
                Generate Bill
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default GenerateBill;
