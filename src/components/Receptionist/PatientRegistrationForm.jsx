import { useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaSave, FaTimes, FaUser } from 'react-icons/fa';
import Button from '../../elements/Button';
import Input from '../../elements/Input';
import Select from '../../elements/Select';
import DatePicker from '../../elements/DatePicker';
import TextArea from '../../elements/TextArea';
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
  const [success, setSuccess] = useState('');
  
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
    
    // Clear error for this field
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
      newErrors.phone_no = 'Invalid phone number (10 digits required)';
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
        setSuccess('Patient updated successfully!');
      } else {
        await receptionistService.patients.create(formData);
        setSuccess('Patient registered successfully!');
      }
      
      // Call onSuccess after 1 second
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1000);
      
    } catch (err) {
      console.error('Error saving patient:', err);
      setError(err.response?.data?.message || 'Failed to save patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="shadow-sm">
        <Card.Body>
          <h4 className="mb-4">
            <FaUser className="me-2" />
            {initialData ? 'Update Patient Information' : 'Patient Registration Form'}
          </h4>

          {error && (
            <Alert variant="danger" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" onClose={() => setSuccess('')} dismissible>
              {success}
            </Alert>
          )}

          {/* Personal Information */}
          <h5 className="text-primary mb-3">Personal Information</h5>
          <Row>
            <Col md={6}>
              <Input
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                error={errors.first_name}
                placeholder="Enter first name"
                required
              />
            </Col>
            <Col md={6}>
              <Input
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                error={errors.last_name}
                placeholder="Enter last name"
                required
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <DatePicker
                label="Date of Birth"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                error={errors.dob}
                required
              />
              {formData.dob && validateAge(formData.dob) && (
                <small className="text-muted">
                  Age: {calculateAge(formData.dob)} years
                </small>
              )}
            </Col>
            <Col md={6}>
              <Select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                error={errors.gender}
                options={GENDERS.map(g => ({ value: g, label: g }))}
                placeholder="Select gender"
                required
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Select
                label="Blood Group"
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
                error={errors.blood_group}
                options={BLOOD_GROUPS.map(bg => ({ value: bg, label: bg }))}
                placeholder="Select blood group"
                required
              />
            </Col>
          </Row>

          {/* Contact Information */}
          <h5 className="text-primary mb-3 mt-4">Contact Information</h5>
          <Row>
            <Col md={6}>
              <Input
                label="Phone Number"
                name="phone_no"
                type="tel"
                value={formData.phone_no}
                onChange={handleChange}
                error={errors.phone_no}
                placeholder="Enter 10-digit phone number"
                maxLength={10}
                required
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
                placeholder="Enter email address"
                required
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <div className="mb-3">
                <label className="form-label">
                  Address <span className="text-danger">*</span>
                </label>
                <TextArea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete address"
                  rows={3}
                />
                {errors.address && (
                  <div className="text-danger small mt-1">{errors.address}</div>
                )}
              </div>
            </Col>
          </Row>

          {/* Action Buttons */}
          <div className="d-flex justify-content-end gap-2 mt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline-secondary"
                onClick={onCancel}
                icon={<FaTimes />}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              icon={<FaSave />}
            >
              {initialData ? 'Update Patient' : 'Register Patient'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </form>
  );
};

export default PatientRegistrationForm;
