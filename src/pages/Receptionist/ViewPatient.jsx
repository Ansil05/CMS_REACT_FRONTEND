import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaTint, 
  FaVenusMars, 
  FaCalendarAlt,  // Changed from FaBirthday
  FaUser 
} from 'react-icons/fa';
import Button from '../../elements/Button';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { receptionistService } from '../../services/receptionistService';
import { formatDate, calculateAge, getInitials } from '../../utils/validations';

const ViewPatient = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatient();
  }, [id]);

  const loadPatient = async () => {
    try {
      setLoading(true);
      const response = await receptionistService.patients.getById(id);
      setPatient(response.data);
    } catch (error) {
      console.error('Error loading patient:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading patient details..." />;
  }

  if (!patient) {
    return (
      <Container fluid>
        <div className="text-center py-5">
          <h3>Patient not found</h3>
          <Button onClick={() => navigate('/receptionist/patients')}>
            Back to Patients
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <Button
                variant="secondary"
                icon={<FaArrowLeft />}
                onClick={() => navigate('/receptionist/patients')}
              >
                Back
              </Button>
              <div>
                <h2 className="fw-bold mb-1">Patient Details</h2>
                <p className="text-muted mb-0">View patient information</p>
              </div>
            </div>
            <Button
              variant="primary"
              icon={<FaEdit />}
              onClick={() => navigate(`/receptionist/patients/edit/${id}`)}
            >
              Edit Patient
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-sm" style={{ borderRadius: 'var(--radius-lg)' }}>
            <Card.Body className="p-4 text-center">
              <div 
                className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: 'var(--radius-xl)',
                  background: 'var(--gradient-primary)',
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: '700'
                }}
              >
                {getInitials(patient.first_name, patient.last_name)}
              </div>
              <h4 className="fw-bold mb-1">
                {patient.first_name} {patient.last_name}
              </h4>
              <p className="text-muted mb-3">Patient ID: #{patient.Patient_id}</p>
              <div className="d-flex gap-2 justify-content-center flex-wrap">
                <span className="badge badge-soft-primary">{patient.gender}</span>
                <span className="badge badge-soft-danger">{patient.blood_group}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8} className="mb-4">
          <Card className="border-0 shadow-sm" style={{ borderRadius: 'var(--radius-lg)' }}>
            <Card.Header className="bg-white border-0 p-4">
              <h5 className="fw-semibold mb-0">Personal Information</h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Row>
                <Col md={6} className="mb-4">
                  <div className="d-flex align-items-start gap-3">
                    <div 
                      className="d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-tertiary)'
                      }}
                    >
                      <FaCalendarAlt size={18} style={{ color: 'var(--primary-600)' }} />
                    </div>
                    <div>
                      <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Date of Birth</p>
                      <p className="fw-medium mb-0">
                        {formatDate(patient.dob)} ({calculateAge(patient.dob)} years)
                      </p>
                    </div>
                  </div>
                </Col>

                <Col md={6} className="mb-4">
                  <div className="d-flex align-items-start gap-3">
                    <div 
                      className="d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-tertiary)'
                      }}
                    >
                      <FaVenusMars size={18} style={{ color: 'var(--primary-600)' }} />
                    </div>
                    <div>
                      <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Gender</p>
                      <p className="fw-medium mb-0">{patient.gender}</p>
                    </div>
                  </div>
                </Col>

                <Col md={6} className="mb-4">
                  <div className="d-flex align-items-start gap-3">
                    <div 
                      className="d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-tertiary)'
                      }}
                    >
                      <FaTint size={18} style={{ color: 'var(--danger)' }} />
                    </div>
                    <div>
                      <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Blood Group</p>
                      <p className="fw-medium mb-0">{patient.blood_group}</p>
                    </div>
                  </div>
                </Col>

                <Col md={6} className="mb-4">
                  <div className="d-flex align-items-start gap-3">
                    <div 
                      className="d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-tertiary)'
                      }}
                    >
                      <FaPhone size={18} style={{ color: 'var(--primary-600)' }} />
                    </div>
                    <div>
                      <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Phone Number</p>
                      <p className="fw-medium mb-0">{patient.phone_no}</p>
                    </div>
                  </div>
                </Col>

                <Col md={6} className="mb-4">
                  <div className="d-flex align-items-start gap-3">
                    <div 
                      className="d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-tertiary)'
                      }}
                    >
                      <FaEnvelope size={18} style={{ color: 'var(--primary-600)' }} />
                    </div>
                    <div>
                      <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Email Address</p>
                      <p className="fw-medium mb-0">{patient.email}</p>
                    </div>
                  </div>
                </Col>

                <Col md={6} className="mb-4">
                  <div className="d-flex align-items-start gap-3">
                    <div 
                      className="d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-tertiary)'
                      }}
                    >
                      <FaUser size={18} style={{ color: 'var(--primary-600)' }} />
                    </div>
                    <div>
                      <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Registration Date</p>
                      <p className="fw-medium mb-0">{formatDate(patient.reg_date)}</p>
                    </div>
                  </div>
                </Col>

                <Col md={12}>
                  <div className="d-flex align-items-start gap-3">
                    <div 
                      className="d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-tertiary)'
                      }}
                    >
                      <FaMapMarkerAlt size={18} style={{ color: 'var(--primary-600)' }} />
                    </div>
                    <div className="flex-grow-1">
                      <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Address</p>
                      <p className="fw-medium mb-0">{patient.address}</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewPatient;
