import { useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaSave, FaTimes, FaUser } from 'react-icons/fa';
import Button from '../../elements/Button';
import Input from '../../elements/Input';
import Select from '../../elements/Select';
import DatePicker from '../../elements/DatePicker';
import Alert from '../../ui/Alert';
import { receptionistService } from '../../services/receptionistService';
import { 
  validateEmail, 
  validatePhone, 
  validateRequired, 
  validateAge,
  calculateAge 
} from '../../utils/validations';
import { BLOOD_GROUPS, GENDERS } from '../../config/constants';

const PatientRegistrationForm = ({ onSuccess, onCancel, initialData = null }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    dob: initialData?.dob || '',
    blood_group: initialData?.blood_group || '',
    gender: initialData?.gender || '',
    phone_no: initialData?.phone_no || '',
    address: initialData?.address || '',
    email: initialData?.email || '',
  });
  const [errors, setErrors] = useState({});

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

    if (!validateRequired(formData.first_name)) {
      newErrors.first_name = 'First name is required';
    }
    if (!validateRequired(formData.last_name)) {
      newErrors.last_name = 'Last name is required';
    }
    if (!validateRequired(formData.dob)) {
      newErrors.dob = 'Date of birth is required';
    } else if (!validateAge(formData.dob)) {
      newErrors.dob = 'Invalid date of birth';
    }
    if (!validateRequired(formData.blood_group)) {
      newErrors.blood_group = 'Blood group is required';
    }
    if (!validateRequired(formData.gender)) {
      newErrors.gender = 'Gender is required';
    }
    if (!validateRequired(formData.phone_no)) {
      newErrors.phone_no = 'Phone number is required';
    } else if (!validatePhone(formData.phone_no)) {
      newErrors.phone_no = 'Invalid phone number';
    }
    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!validateRequired(formData.address)) {
      newErrors.address = 'Address is required';
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
        await receptionistService.patients.update(initialData.Patient_id, formData);
      } else {
        await receptionistService.patients.create(formData);
      }
      
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm" style={{ borderRadius: 'var(--radius-lg)' }}>
      <Card.Header 
        className="border-0 d-flex align-items-center gap-2"
        style={{ 
          background: 'var(--gradient-primary)',
          color: 'white',
          padding: '1rem 1.5rem'
        }}
      >
        <FaUser size={20} />
        <h5 className="mb-0 fw-semibold">
          {initialData ? 'Update Patient Information' : 'Patient Registration Form'}
        </h5>
      </Card.Header>
      
      <Card.Body className="p-4">
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <h6 className="fw-semibold mb-3 text-muted">Personal Information</h6>
          
          <Row>
            <Col md={6}>
              <Input
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                error={errors.first_name}
                required
                placeholder="Enter first name"
              />
            </Col>
            <Col md={6}>
              <Input
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                error={errors.last_name}
                required
                placeholder="Enter last name"
              />
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <DatePicker
                label="Date of Birth"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                error={errors.dob}
                required
              />
              {formData.dob && validateAge(formData.dob) && (
                <small className="text-muted">Age: {calculateAge(formData.dob)} years</small>
              )}
            </Col>
            <Col md={4}>
              <Select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                error={errors.gender}
                required
                options={GENDERS.map(g => ({ value: g, label: g }))}
                placeholder="Select gender"
              />
            </Col>
            <Col md={4}>
              <Select
                label="Blood Group"
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
                error={errors.blood_group}
                required
                options={BLOOD_GROUPS.map(bg => ({ value: bg, label: bg }))}
                placeholder="Select blood group"
              />
            </Col>
          </Row>

          {/* Contact Information */}
          <h6 className="fw-semibold mb-3 mt-4 text-muted">Contact Information</h6>

          <Row>
            <Col md={6}>
              <Input
                label="Phone Number"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleChange}
                error={errors.phone_no}
                required
                placeholder="Enter phone number"
              />
            </Col>
            <Col md={6}>
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                placeholder="Enter email address"
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <div className="form-group">
                <label className="form-label form-label-required">Address</label>
                <textarea
                  className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter full address"
                />
                {errors.address && (
                  <div className="invalid-feedback">{errors.address}</div>
                )}
              </div>
            </Col>
          </Row>

          <div className="d-flex gap-2 justify-content-end mt-4 pt-3" style={{ borderTop: '1px solid var(--border-light)' }}>
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
              {initialData ? 'Update Patient' : 'Register Patient'}
            </Button>
          </div>
        </form>
      </Card.Body>
    </Card>
  );
};

export default PatientRegistrationForm;
