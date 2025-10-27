import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaCalendarCheck, FaMoneyBillWave, FaCreditCard, FaMobileAlt, FaMoneyCheck } from 'react-icons/fa';
import Button from '../../elements/Button';
import Select from '../../elements/Select';
import DatePicker from '../../elements/DatePicker';
import Input from '../../elements/Input';
import Alert from '../../ui/Alert';
import PaymentModal from '../../components/Receptionist/PaymentModal';
import BillPreview from '../../components/Receptionist/BillPreview';
import { receptionistService } from '../../services/receptionistService';
import { validateRequired } from '../../utils/validations';

const AddAppointment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // Form Data
  const [formData, setFormData] = useState({
    patient: '',
    doc_id: '',
    appointment_date: '',
    appointment_time: '',
    reg_fee: '200',
    doc_fee: '500',
    payment_mode: 'Cash'
  });

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [generatedBill, setGeneratedBill] = useState(null);
  const [generatedAppointment, setGeneratedAppointment] = useState(null);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [patientsRes, doctorsRes] = await Promise.all([
        receptionistService.patients.getAll(),
        // If you have doctors endpoint, uncomment:
        // receptionistService.doctors.getAll()
      ]);
      setPatients(patientsRes.data || []);
      // setDoctors(doctorsRes.data || []);
      
      // Mock doctors for now
      setDoctors([
        { id: 1, name: 'Dr. Smith', specialization: 'Cardiology' },
        { id: 2, name: 'Dr. Johnson', specialization: 'Neurology' },
        { id: 3, name: 'Dr. Williams', specialization: 'Orthopedics' }
      ]);
    } catch (err) {
      setError('Failed to load data. Please refresh the page.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Load patient details when selected
    if (name === 'patient' && value) {
      const patient = patients.find(p => p.Patient_id === parseInt(value));
      setSelectedPatient(patient);
    }

    // Auto-calculate total when fees change
    if (name === 'reg_fee' || name === 'doc_fee') {
      calculateTotal();
    }
  };

  const calculateTotal = () => {
    const regFee = parseFloat(formData.reg_fee) || 0;
    const docFee = parseFloat(formData.doc_fee) || 0;
    return regFee + docFee;
  };

  const validate = () => {
    const newErrors = {};
    
    if (!validateRequired(formData.patient)) {
      newErrors.patient = 'Please select a patient';
    }
    if (!validateRequired(formData.doc_id)) {
      newErrors.doc_id = 'Please select a doctor';
    }
    if (!validateRequired(formData.appointment_date)) {
      newErrors.appointment_date = 'Please select appointment date';
    }
    if (!validateRequired(formData.appointment_time)) {
      newErrors.appointment_time = 'Please select appointment time';
    }
    if (!validateRequired(formData.reg_fee) || parseFloat(formData.reg_fee) <= 0) {
      newErrors.reg_fee = 'Please enter a valid registration fee';
    }
    if (!validateRequired(formData.doc_fee) || parseFloat(formData.doc_fee) <= 0) {
      newErrors.doc_fee = 'Please enter a valid consultation fee';
    }
    if (!validateRequired(formData.payment_mode)) {
      newErrors.payment_mode = 'Please select payment mode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (!validate()) {
      setError('Please fill all required fields correctly');
      return;
    }

    // If Cash payment, show confirmation modal directly
    // If UPI/Card, show payment modal first
    if (formData.payment_mode === 'Cash') {
      setShowPaymentModal(true);
    } else {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentConfirmed = async (paymentDetails) => {
    setShowPaymentModal(false);
    setLoading(true);
    setError('');

    try {
      // Create appointment
      const appointmentData = {
        patient: formData.patient,
        doc_id: formData.doc_id,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
      };
      const appointmentRes = await receptionistService.appointments.create(appointmentData);
      
      // Create bill
      const billData = {
        patient: formData.patient,
        appointment: appointmentRes.data.id,
        reg_fee: formData.reg_fee,
        doc_fee: formData.doc_fee,
        payment_mode: paymentDetails.mode,
        payment_status: 'PAID',
        payment_reference: paymentDetails.reference,
        payment_timestamp: paymentDetails.timestamp
      };
      const billRes = await receptionistService.bills.create(billData);

      // Store generated data for bill preview
      setGeneratedAppointment({
        ...appointmentRes.data,
        doctor_name: doctors.find(d => d.id === parseInt(formData.doc_id))?.name,
        department: doctors.find(d => d.id === parseInt(formData.doc_id))?.specialization,
        token_no: `T${Date.now().toString().slice(-6)}`
      });
      setGeneratedBill({
        ...billRes.data,
        ...billData
      });

      setSuccess('Appointment booked and bill generated successfully!');
      setShowBillPreview(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create appointment and bill');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseBillPreview = () => {
    setShowBillPreview(false);
    navigate('/app/receptionist/appointments');
  };

  // If bill preview is shown, render only that
  if (showBillPreview && generatedBill && selectedPatient) {
    return (
      <Container fluid className="py-4">
        <BillPreview
          bill={generatedBill}
          patient={selectedPatient}
          appointment={generatedAppointment}
          onClose={handleCloseBillPreview}
        />
      </Container>
    );
  }

  const totalAmount = calculateTotal();

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center gap-3">
            <Button
              variant="outline-primary"
              icon={<FaArrowLeft />}
              onClick={() => navigate('/app/receptionist/appointments')}
            >
              Back
            </Button>
            <div>
              <h2 className="mb-1">Book Appointment & Generate Bill</h2>
              <p className="text-muted mb-0">Schedule appointment and create billing in one step</p>
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

      <form onSubmit={handleSubmitClick}>
        <Row>
          <Col lg={8}>
            {/* Appointment Details Section */}
            <Card className="mb-4 shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <FaCalendarCheck className="me-2" />
                  Appointment Details
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Select
                      label="Select Patient"
                      name="patient"
                      value={formData.patient}
                      onChange={handleChange}
                      error={errors.patient}
                      required
                    >
                      <option value="">Choose Patient</option>
                      {patients.map(patient => (
                        <option key={patient.Patient_id} value={patient.Patient_id}>
                          {patient.first_name} {patient.last_name} - {patient.phone_no}
                        </option>
                      ))}
                    </Select>
                  </Col>

                  <Col md={6}>
                    <Select
                      label="Select Doctor"
                      name="doc_id"
                      value={formData.doc_id}
                      onChange={handleChange}
                      error={errors.doc_id}
                      required
                    >
                      <option value="">Choose Doctor</option>
                      {doctors.map(doctor => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialization}
                        </option>
                      ))}
                    </Select>
                  </Col>

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
                    <Input
                      label="Appointment Time"
                      type="time"
                      name="appointment_time"
                      value={formData.appointment_time}
                      onChange={handleChange}
                      error={errors.appointment_time}
                      required
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Billing Section */}
            <Card className="mb-4 shadow-sm">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">
                  <FaMoneyBillWave className="me-2" />
                  Billing Details
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Input
                      label="Registration Fee"
                      type="number"
                      name="reg_fee"
                      value={formData.reg_fee}
                      onChange={handleChange}
                      error={errors.reg_fee}
                      required
                      min="0"
                      step="0.01"
                    />
                  </Col>

                  <Col md={6}>
                    <Input
                      label="Consultation Fee"
                      type="number"
                      name="doc_fee"
                      value={formData.doc_fee}
                      onChange={handleChange}
                      error={errors.doc_fee}
                      required
                      min="0"
                      step="0.01"
                    />
                  </Col>
                </Row>

                {/* Total Amount Display */}
                <div className="mt-3 p-3 bg-light rounded text-center">
                  <p className="text-muted mb-1">Total Amount</p>
                  <h3 className="mb-0 text-success">₹{totalAmount.toFixed(2)}</h3>
                </div>
              </Card.Body>
            </Card>

            {/* Payment Mode Section */}
            <Card className="mb-4 shadow-sm">
              <Card.Header className="bg-info text-white">
                <h5 className="mb-0">
                  <FaCreditCard className="me-2" />
                  Payment Mode
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="row g-3">
                  {[
                    { value: 'Cash', icon: <FaMoneyBillWave />, color: 'success', label: 'Cash Payment' },
                    { value: 'UPI', icon: <FaMobileAlt />, color: 'primary', label: 'UPI / QR Code' },
                    { value: 'Card', icon: <FaCreditCard />, color: 'info', label: 'Debit / Credit Card' },
                    { value: 'Cheque', icon: <FaMoneyCheck />, color: 'warning', label: 'Cheque' }
                  ].map(mode => (
                    <div key={mode.value} className="col-md-6">
                      <div
                        className={`p-3 border rounded cursor-pointer ${
                          formData.payment_mode === mode.value
                            ? `border-${mode.color} bg-${mode.color} bg-opacity-10`
                            : 'border-secondary'
                        }`}
                        style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                        onClick={() => setFormData(prev => ({ ...prev, payment_mode: mode.value }))}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <input
                            type="radio"
                            name="payment_mode"
                            value={mode.value}
                            checked={formData.payment_mode === mode.value}
                            onChange={handleChange}
                            className="form-check-input"
                            style={{ cursor: 'pointer' }}
                          />
                          <div className={`text-${mode.color}`} style={{ fontSize: '24px' }}>
                            {mode.icon}
                          </div>
                          <div>
                            <strong>{mode.label}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.payment_mode && (
                  <div className="text-danger small mt-2">{errors.payment_mode}</div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Summary Sidebar */}
          <Col lg={4}>
            <Card className="shadow-sm sticky-top" style={{ top: '20px' }}>
              <Card.Header className="bg-gradient text-white">
                <h5 className="mb-0">Summary</h5>
              </Card.Header>
              <Card.Body>
                {selectedPatient ? (
                  <>
                    <h6 className="text-primary mb-3">Patient Information</h6>
                    <p className="mb-1"><strong>Name:</strong> {selectedPatient.first_name} {selectedPatient.last_name}</p>
                    <p className="mb-1"><strong>Age:</strong> {selectedPatient.age || 'N/A'} years</p>
                    <p className="mb-1"><strong>Phone:</strong> {selectedPatient.phone_no}</p>
                    <p className="mb-3"><strong>Blood Group:</strong> {selectedPatient.blood_group || 'N/A'}</p>
                    <hr />
                  </>
                ) : (
                  <p className="text-muted">Please select a patient to see details</p>
                )}

                <h6 className="text-success mb-3">Billing Breakdown</h6>
                <div className="d-flex justify-content-between mb-2">
                  <span>Registration Fee:</span>
                  <strong>₹{parseFloat(formData.reg_fee || 0).toFixed(2)}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Consultation Fee:</span>
                  <strong>₹{parseFloat(formData.doc_fee || 0).toFixed(2)}</strong>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <span className="h6">Total Amount:</span>
                  <h5 className="text-success mb-0">₹{totalAmount.toFixed(2)}</h5>
                </div>

                <div className="mb-3">
                  <span className="badge bg-info mb-2">Payment Mode</span>
                  <h6 className="mb-0">{formData.payment_mode}</h6>
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  fullWidth
                  loading={loading}
                  icon={<FaSave />}
                  size="lg"
                >
                  Book Appointment & Generate Bill
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </form>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentConfirmed={handlePaymentConfirmed}
        amount={totalAmount}
        patientName={selectedPatient ? `${selectedPatient.first_name} ${selectedPatient.last_name}` : ''}
        paymentMode={formData.payment_mode}
      />
    </Container>
  );
};

export default AddAppointment;
