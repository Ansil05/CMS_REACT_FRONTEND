import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaPrint } from 'react-icons/fa';
import Button from '../../elements/Button';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { receptionistService } from '../../services/receptionistService';
import { formatDate, formatTime, formatCurrency } from '../../utils/validations';

const ViewBill = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const printRef = useRef();
  const [bill, setBill] = useState(null);
  const [patient, setPatient] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBillDetails();
  }, [id]);

  const loadBillDetails = async () => {
    try {
      setLoading(true);
      const billRes = await receptionistService.bills.getById(id);
      const billData = billRes.data;
      setBill(billData);

      const patientRes = await receptionistService.patients.getById(billData.patient);
      setPatient(patientRes.data);

      const appointmentRes = await receptionistService.appointments.getById(billData.appointment);
      setAppointment(appointmentRes.data);
    } catch (error) {
      console.error('Error loading bill details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading receipt..." />;
  }

  if (!bill || !patient || !appointment) {
    return <div>Receipt not found</div>;
  }

  return (
    <Container fluid>
      <Row className="mb-4 no-print">
        <Col>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <Button
                variant="secondary"
                icon={<FaArrowLeft />}
                onClick={() => navigate('/receptionist/billing')}
              >
                Back
              </Button>
              <div>
                <h2 className="fw-bold mb-1">Billing Receipt</h2>
                <p className="text-muted mb-0">Bill ID: #{bill.bill_id}</p>
              </div>
            </div>
            <Button
              variant="primary"
              icon={<FaPrint />}
              onClick={handlePrint}
            >
              Print Receipt
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={8} className="mx-auto">
          <Card 
            ref={printRef}
            className="border shadow-sm" 
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            <Card.Body className="p-5">
              {/* Header */}
              <div className="text-center mb-5">
                <h2 
                  className="fw-bold mb-2" 
                  style={{ 
                    color: 'var(--primary-600)',
                    fontSize: '2rem',
                    letterSpacing: '2px'
                  }}
                >
                  Clinic Receipt
                </h2>
                <div 
                  style={{ 
                    height: '3px',
                    background: 'var(--gradient-primary)',
                    width: '100px',
                    margin: '0 auto'
                  }}
                />
              </div>

              {/* Token Number */}
              <div className="mb-4">
                <div className="d-flex align-items-center mb-2">
                  <strong style={{ minWidth: '150px' }}>Token No:</strong>
                  <span className="badge badge-soft-primary" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                    {appointment.token_number}
                  </span>
                </div>
              </div>

              {/* Patient Details */}
              <div className="mb-4">
                <div className="d-flex mb-2">
                  <strong style={{ minWidth: '150px' }}>Patient:</strong>
                  <span>{patient.first_name} {patient.last_name} (ID: {patient.Patient_id})</span>
                </div>
                <div className="d-flex mb-2">
                  <strong style={{ minWidth: '150px' }}>Phone:</strong>
                  <span>{patient.phone_no}</span>
                </div>
                <div className="d-flex mb-2">
                  <strong style={{ minWidth: '150px' }}>Doctor:</strong>
                  <span>Doctor ID #{appointment.doc_id}</span>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="mb-4">
                <div className="d-flex mb-2">
                  <strong style={{ minWidth: '150px' }}>Date:</strong>
                  <span>{formatDate(appointment.appointment_date)}</span>
                </div>
                <div className="d-flex mb-2">
                  <strong style={{ minWidth: '150px' }}>Time:</strong>
                  <span>{formatTime(appointment.appointment_time)}</span>
                </div>
              </div>

              {/* Divider */}
              <hr style={{ border: '2px solid var(--border-color)', margin: '2rem 0' }} />

              {/* Fee Details */}
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-3">
                  <strong>Registration Fee:</strong>
                  <span style={{ fontSize: '1.125rem' }}>{formatCurrency(bill.reg_fee)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <strong>Consultation Fee:</strong>
                  <span style={{ fontSize: '1.125rem' }}>{formatCurrency(bill.doc_fee)}</span>
                </div>
              </div>

              {/* Total */}
              <div 
                className="p-3 mb-4"
                style={{
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--primary-200)'
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0">Total Paid:</h5>
                  <h3 className="fw-bold mb-0" style={{ color: 'var(--primary-600)' }}>
                    {formatCurrency(bill.total)}
                  </h3>
                </div>
              </div>

              {/* Payment Details */}
              <div className="mb-4">
                <div className="d-flex mb-2">
                  <strong style={{ minWidth: '150px' }}>Payment Date:</strong>
                  <span>{formatDate(bill.created_at?.split('T')[0])}</span>
                </div>
                <div className="d-flex mb-2">
                  <strong style={{ minWidth: '150px' }}>Payment Method:</strong>
                  <span>UPI</span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-5 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                <p className="text-muted mb-2" style={{ fontSize: '0.875rem' }}>
                  Thank you for visiting our clinic!
                </p>
                <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                  This is a computer generated receipt
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewBill;
