import { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaSave, FaTimes, FaCalculator } from 'react-icons/fa';
import Button from '../../elements/Button';
import Select from '../../elements/Select';
import Input from '../../elements/Input';
import Alert from '../../ui/Alert';
import { receptionistService } from '../../services/receptionistService';
import { validateRequired, validatePositiveNumber, formatCurrency } from '../../utils/validations';

const BillingForm = ({ onSuccess, onCancel, initialData = null }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    patient: initialData?.patient || '',
    appointment: initialData?.appointment || '',
    reg_fee: initialData?.reg_fee || '',
    doc_fee: initialData?.doc_fee || '',
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
      
      if (initialData) {
        await receptionistService.bills.update(initialData.bill_id, billData);
      } else {
        await receptionistService.bills.create(billData);
      }
      
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save bill');
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
                placeholder="0.00"
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
                placeholder="0.00"
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <div 
                className="p-4 mb-4 d-flex align-items-center justify-content-between"
                style={{
                  background: 'var(--gradient-primary)',
                  borderRadius: 'var(--radius-lg)',
                  color: 'white'
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <FaCalculator size={24} />
                  <h5 className="mb-0 fw-semibold">Total Amount:</h5>
                </div>
                <h2 className="mb-0 fw-bold">
                  {formatCurrency(total)}
                </h2>
              </div>
            </Col>
          </Row>

          <div className="d-flex gap-2 justify-content-end">
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
              {initialData ? 'Update Bill' : 'Generate Bill'}
            </Button>
          </div>
        </form>
      </Card.Body>
    </Card>
  );
};

export default BillingForm;
