import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PatientRegistrationForm from '../../components/Receptionist/PatientRegistrationForm';
import LoadingSpinner from '../../ui/LoadingSpinner';

const AddPatient = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSuccess = () => {
    // after successful registration navigate to patients list
    navigate('/receptionist/patients');
  };

  if (loading) return <LoadingSpinner fullScreen message="Processing..." />;

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold mb-1">Add New Patient</h2>
          <p className="text-muted mb-0">Fill in patient details to register</p>
        </Col>
      </Row>

      <Row>
        <Col lg={8} className="mx-auto">
          <PatientRegistrationForm onSuccess={handleSuccess} onCancel={() => navigate('/receptionist/patients')} />
        </Col>
      </Row>
    </Container>
  );
};

export default AddPatient;
