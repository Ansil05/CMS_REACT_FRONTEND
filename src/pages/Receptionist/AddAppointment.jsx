import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaCalendarCheck, FaMoneyBillWave, FaCreditCard, FaMobileAlt, FaMoneyCheck } from 'react-icons/fa';
import Button from '../../elements/Button';
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
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    patient: '',
    doc_id: '',
    appointment_date: '',
    appointment_time: '',
    reg_fee: '100',
    doc_fee: '180',
    payment_mode: 'Cash'
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [generatedData, setGeneratedData] = useState({ bill: null, appointment: null });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [patientsRes, doctorsRes] = await Promise.all([
        receptionistService.patients.getAll(),
        receptionistService.doctors.getAll()
      ]);
      
      setPatients(patientsRes.data || []);
      setDoctors(doctorsRes.data || []);
    } catch (err) {
      setError('Failed to load data. Please refresh the page.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'patient' && value) {
      const patient = patients.find(p => p.Patient_id === parseInt(value));
      setSelectedPatient(patient);
    }
    if (name ==='doctor' && value){
      const doctor = doctors.find(d=>d.Id === parseInt(value));
      setSelectedDoctor(doctor);
    }
  };

  const calculateTotal = () => {
    return (parseFloat(formData.reg_fee) || 0) + (parseFloat(formData.doc_fee) || 0);
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.patient || formData.patient === '') {
      newErrors.patient = 'Please select a patient';
    }
    
    if (!formData.doc_id || formData.doc_id === '') {
      newErrors.doc_id = 'Please select a doctor';
    }
    
    if (!validateRequired(formData.appointment_date)) {
      newErrors.appointment_date = 'Please select appointment date';
    }
    
    if (!validateRequired(formData.appointment_time)) {
      newErrors.appointment_time = 'Please select appointment time';
    }

    ['reg_fee', 'doc_fee'].forEach(field => {
      if (!validateRequired(formData[field]) || parseFloat(formData[field]) <= 0) {
        newErrors[field] = `Please enter a valid ${field === 'reg_fee' ? 'registration' : 'consultation'} fee`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (!validate()) {
      setError('Please fill all required fields correctly');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentConfirmed = async (paymentDetails) => {
    setShowPaymentModal(false);
    setLoading(true);
    setError('');

    try {
      // ✅ Check for empty BEFORE converting
      if (!formData.patient || formData.patient === '' || formData.patient === '0') {
        setError('Please select a patient');
        setLoading(false);
        return;
      }

      if (!formData.doc_id || formData.doc_id === '' || formData.doc_id === '0') {
        setError('Please select a doctor');
        setLoading(false);
        return;
      }

      // ✅ NOW convert to integers
      const patientId = parseInt(formData.patient, 10);
      const doctorId = parseInt(formData.doc_id, 10);

      console.log('✅ Converted Values:', { 
        patientId, 
        doctorId,
        isPatientValid: !isNaN(patientId),
        isDoctorValid: !isNaN(doctorId)
      });

      // ✅ Double check they're valid numbers
      if (isNaN(patientId)) {
        setError('Invalid patient ID');
        setLoading(false);
        return;
      }

      if (isNaN(doctorId)) {
        setError('Invalid doctor ID');
        setLoading(false);
        return;
      }

      // ✅ Create Appointment
      const appointmentPayload = {
        patient: patientId,
        doc_id: doctorId,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        status: 'Scheduled'
      };

      console.log('✅ Final Payload:', appointmentPayload);

      const appointmentResponse = await receptionistService.appointments.create(appointmentPayload);
      
      if (!appointmentResponse.data) throw new Error('Failed to create appointment');

      const appointmentId = appointmentResponse.data.appointment_id || appointmentResponse.data.id;

      // ✅ Generate Bill
      const totalAmount = calculateTotal();
      const billPayload = {
        patient: patientId,
        appointment: appointmentId,
        reg_fee: parseFloat(formData.reg_fee),
        doc_fee: parseFloat(formData.doc_fee),
        total_amount: totalAmount,
        paid_amount: totalAmount,
        balance_amount: 0,
        payment_mode: paymentDetails.mode,
        payment_status: 'PAID',
        payment_reference: paymentDetails.reference,
        payment_timestamp: paymentDetails.timestamp,
        bill_date: new Date().toISOString()
      };

      const billResponse = await receptionistService.bills.create(billPayload);

      if (!billResponse.data) throw new Error('Failed to generate bill');

      // ✅ Find doctor using Id
      const selectedDoctor = doctors.find(d => d.Id === doctorId);
      
      setGeneratedData({
        bill: {
          ...billResponse.data,
          reg_fee: formData.reg_fee,
          doc_fee: formData.doc_fee,
          payment_mode: paymentDetails.mode
        },
        appointment: {
          ...appointmentResponse.data,
          doctor_name: selectedDoctor?.Staff?.FirstName || 'Doctor',
          department: selectedDoctor?.Specialization?.SpecializationName || 'General',
          token_no: appointmentResponse.data.token_number || `TKN${Date.now().toString().slice(-6)}`
        }
      });

      setSuccess('Appointment booked and bill generated successfully!');
      setShowBillPreview(true);

    } catch (err) {
      console.error('❌ Error:', err);
      console.error('❌ Error Response:', err.response?.data);
      setError(err.response?.data?.message || err.message || 'Failed to process appointment and billing');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseBillPreview = () => {
    setShowBillPreview(false);
    navigate('/app/receptionist/appointments');
  };

  if (showBillPreview && generatedData.bill && selectedPatient) {
    return (
      <Container fluid className="py-4">
        <BillPreview
          bill={generatedData.bill}
          patient={selectedPatient}
          appointment={generatedData.appointment}
          onClose={handleCloseBillPreview}
        />
      </Container>
    );
  }

  const totalAmount = calculateTotal();
  const paymentModes = [
    { value: 'Cash', icon: FaMoneyBillWave, color: 'success', label: 'Cash Payment' },
    { value: 'UPI', icon: FaMobileAlt, color: 'primary', label: 'UPI / QR Code' },
    { value: 'Card', icon: FaCreditCard, color: 'info', label: 'Debit / Credit Card' },
    { value: 'Cheque', icon: FaMoneyCheck, color: 'warning', label: 'Cheque' }
  ];

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
            <Card className="mb-4 shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <FaCalendarCheck className="me-2" />
                  Appointment Details
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        Patient <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name="patient"
                        value={formData.patient}
                        onChange={handleChange}
                        isInvalid={!!errors.patient}
                        style={{ height: '45px', fontSize: '15px' }}
                      >
                        <option value="">Select Patient</option>
                        {patients.map(p => (
                          <option key={`patient-${p.Patient_id}`} value={p.Patient_id}>
                            {p.first_name} {p.last_name} (ID: {p.Patient_id})
                          </option>
                        ))}
                      </Form.Select>
                      {errors.patient && (
                        <Form.Control.Feedback type="invalid" className="d-block">
                          {errors.patient}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        Doctor <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name="doc_id"
                        value={formData.doc_id}
                        onChange={handleChange}
                        isInvalid={!!errors.doc_id}
                        style={{ height: '45px', fontSize: '15px' }}
                      >
                        <option value="">Select Doctor</option>
                        {doctors.map((d) => (
                          <option
                            key={`doctor-${d.DoctorId}`}
                            value={d.DoctorId}
                          >
                           Dr. {d.StaffDetail?.FirstName} {d.StaffDetail?.LastName} - {d.SpecializationDetails?.SpecializationName}
                          </option>
                        ))}
                      </Form.Select>
                      {errors.doc_id && (
                        <Form.Control.Feedback type="invalid" className="d-block">
                          {errors.doc_id}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
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
                <div className="mt-3 p-3 bg-light rounded text-center">
                  <p className="text-muted mb-1">Total Amount</p>
                  <h3 className="mb-0 text-success">₹{totalAmount.toFixed(2)}</h3>
                </div>
              </Card.Body>
            </Card>

            <Card className="mb-4 shadow-sm">
              <Card.Header className="bg-info text-white">
                <h5 className="mb-0">
                  <FaCreditCard className="me-2" />
                  Payment Mode
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="row g-3">
                  {paymentModes.map(mode => {
                    const Icon = mode.icon;
                    return (
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
                            />
                            <Icon className={`text-${mode.color}`} size={24} />
                            <strong>{mode.label}</strong>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="shadow-sm sticky-top" style={{ top: '20px' }}>
              <Card.Header 
                className="bg-gradient text-white" 
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                <h5 className="mb-0">Summary</h5>
              </Card.Header>
              <Card.Body>
                {selectedPatient ? (
                  <>
                    <h6 className="text-primary mb-3">Patient Information</h6>
                    <p className="mb-1">
                      <strong>Name:</strong> {selectedPatient.first_name} {selectedPatient.last_name}
                    </p>
                    <p className="mb-1">
                      <strong>Age:</strong> {selectedPatient.age || 'N/A'} years
                    </p>
                    <p className="mb-1">
                      <strong>Phone:</strong> {selectedPatient.phone_no}
                    </p>
                    <p className="mb-3">
                      <strong>Blood Group:</strong> {selectedPatient.blood_group || 'N/A'}
                    </p>
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

      <PaymentModal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        onPaymentConfirmed={handlePaymentConfirmed}
        amount={totalAmount}
        patientName={selectedPatient ? `${selectedPatient.first_name} ${selectedPatient.last_name}` : ''}
        paymentMode={formData.payment_mode}
      />
    </Container>
  );
};

export default AddAppointment;
