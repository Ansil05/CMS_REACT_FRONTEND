import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import Button from '../../elements/Button';
import Input from '../../elements/Input';
import Select from '../../elements/Select';
import DatePicker from '../../elements/DatePicker';
import Alert from '../../ui/Alert';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { receptionistService } from '../../services/receptionistService';
import { validateEmail, validatePhone, validateRequired, validateAge } from '../../utils/validations';
import { BLOOD_GROUPS, GENDERS } from '../../config/constants';

const EditPatient = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    dob: '',
    blood_group: '',
    gender: '',
    phone_no: '',
    address: '',
    email: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadPatient();
  }, [id]);

  const loadPatient = async () => {
    try {
      setLoading(true);
      const response = await receptionistService.patients.getById(id);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to load patient data');
    } finally {
      setLoading(false);
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
      setSubmitting(true);
      setError('');
      await receptionistService.patients.update(id, formData);
      setSuccess('Patient updated successfully!');
      setTimeout(() => {
        navigate('/receptionist/patients');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update patient');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading patient data..." />;
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center gap-3">
            <Button
              variant="secondary"
              icon={<FaArrowLeft />}
              onClick={() => navigate('/receptionist/patients')}
            >
              Back
            </Button>
            <div>
              <h2 className="fw-bold mb-1">Edit Patient</h2>
              <p className="text-muted mb-0">Update patient information</p>
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
              <Col md={6}>
                <DatePicker
                  label="Date of Birth"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  error={errors.dob}
                  required
                />
              </Col>
              <Col md={6}>
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

            <Row>
              <Col md={6}>
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
            </Row>

            <Row>
              <Col md={12}>
                <Input
                  label="Email"
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

            <div className="form-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/receptionist/patients')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient"
                icon={<FaSave />}
                loading={submitting}
              >
                Update Patient
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditPatient;
