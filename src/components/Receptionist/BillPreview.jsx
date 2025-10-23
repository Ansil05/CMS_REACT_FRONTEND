import { useRef, useState } from 'react';
import { Card } from 'react-bootstrap';
import { FaPrint, FaTimes, FaDownload, FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import Button from '../../elements/Button';
// import { generateSimpleBillPDF } from '../../utils/pdfGenerator';
// import { sendBillReceipt, isValidEmail } from '../../services/emailService';
import { formatDate, formatCurrency } from '../../utils/validations';
import Alert from '../../ui/Alert';

const BillPreview = ({ 
  bill, 
  patient, 
  appointment, 
  onClose, 
  showPrint = true 
}) => {
  const printRef = useRef();
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    generateSimpleBillPDF(bill, patient);
  };

  const handleSendEmail = async () => {
    // Validate email
    if (!patient.email || !isValidEmail(patient.email)) {
      setEmailStatus({ type: 'error', message: 'Patient email is invalid or missing' });
      return;
    }

    setSendingEmail(true);
    setEmailStatus(null);

    const billData = {
      patientEmail: patient.email,
      patientName: `${patient.first_name} ${patient.last_name}`,
      billNumber: bill.bill_id || 'BILL' + Date.now(),
      billDate: formatDate(new Date()),
      registrationFee: formatCurrency(bill.reg_fee),
      consultationFee: formatCurrency(bill.doc_fee),
      totalAmount: formatCurrency(parseFloat(bill.reg_fee || 0) + parseFloat(bill.doc_fee || 0)),
      paymentMode: bill.payment_mode,
    };

    const result = await sendBillReceipt(billData);
    
    setSendingEmail(false);
    setEmailStatus({
      type: result.success ? 'success' : 'error',
      message: result.message
    });

    // Clear status after 5 seconds
    setTimeout(() => setEmailStatus(null), 5000);
  };

  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getPaymentBadge = (mode) => {
    const badges = {
      'Cash': 'success',
      'UPI': 'primary',
      'Card': 'info',
      'Cheque': 'warning'
    };
    return badges[mode] || 'secondary';
  };

  return (
    <div className="bill-preview-container">
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
            .bill-preview-container {
              width: 100%;
              max-width: none;
            }
          }
        `}
      </style>

      {/* Header Actions */}
      {showPrint && (
        <>
          {emailStatus && (
            <Alert 
              variant={emailStatus.type} 
              dismissible 
              onClose={() => setEmailStatus(null)}
              className="mb-3 no-print"
            >
              {emailStatus.type === 'success' && <FaCheckCircle className="me-2" />}
              {emailStatus.message}
            </Alert>
          )}

          <div className="d-flex justify-content-end gap-2 mb-3 no-print">
            <Button 
              variant="success" 
              icon={<FaEnvelope />} 
              onClick={handleSendEmail}
              loading={sendingEmail}
              disabled={!patient.email}
            >
              {sendingEmail ? 'Sending...' : 'Email Bill'}
            </Button>
            <Button variant="info" icon={<FaDownload />} onClick={handleDownloadPDF}>
              Download PDF
            </Button>
            <Button variant="primary" icon={<FaPrint />} onClick={handlePrint}>
              Print Bill
            </Button>
            <Button variant="secondary" icon={<FaTimes />} onClick={onClose}>
              Close
            </Button>
          </div>
        </>
      )}

      {/* Bill Content */}
      <Card ref={printRef} className="shadow-sm">
        <Card.Body style={{ padding: '40px' }}>
          {/* Hospital Header */}
          <div className="text-center mb-4 pb-3 border-bottom">
            <h2 className="mb-1" style={{ 
              color: '#1976d2', 
              fontWeight: 'bold',
              fontSize: '28px'
            }}>
              🏥 FAITH MULTI SPECIALITY HOSPITAL
            </h2>
            <p className="text-muted mb-1">123 Medical District, Chennai - 600001</p>
            <p className="text-muted mb-0">
              ☎ +91-44-12345678 | ✉ info@faithhospital.com
            </p>
          </div>

          {/* Bill Title */}
          <div className="text-center mb-4">
            <h4 style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '10px',
              borderRadius: '8px',
              fontWeight: 'bold'
            }}>
              BILLING RECEIPT
            </h4>
          </div>

          {/* Bill Info */}
          <div className="row mb-4">
            <div className="col-6">
              <p className="mb-1"><strong>Bill No:</strong> #{bill.bill_id || 'BILL' + Date.now()}</p>
              <p className="mb-0"><strong>Date:</strong> {formatDate(new Date())}</p>
            </div>
            <div className="col-6 text-end">
              <p className="mb-1"><strong>Time:</strong> {formatTime(new Date())}</p>
              <p className="mb-0">
                <strong>Payment:</strong>{' '}
                <span className={`badge bg-${getPaymentBadge(bill.payment_mode)}`}>
                  {bill.payment_mode} - PAID
                </span>
              </p>
            </div>
          </div>

          {/* Patient Details */}
          <div className="mb-4 p-3" style={{ 
            background: '#f8f9fa', 
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h6 className="mb-3" style={{ color: '#1976d2' }}>Patient Details:</h6>
            <div className="row">
              <div className="col-8">
                <p className="mb-1"><strong>Name:</strong> {patient.first_name} {patient.last_name}</p>
                <p className="mb-1"><strong>Age:</strong> {patient.age} years</p>
                <p className="mb-0"><strong>Phone:</strong> {patient.phone_no}</p>
              </div>
              <div className="col-4">
                <p className="mb-1"><strong>Patient ID:</strong> #{patient.Patient_id}</p>
                <p className="mb-0"><strong>Gender:</strong> {patient.gender}</p>
              </div>
            </div>
            {patient.address && (
              <p className="mb-0 mt-2"><strong>Address:</strong> {patient.address}</p>
            )}
          </div>

          {/* Services Table */}
          <table className="table table-bordered mb-4">
            <thead style={{ background: '#f8f9fa' }}>
              <tr>
                <th style={{ width: '60%' }}>Service Description</th>
                <th className="text-end">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Registration Fee</td>
                <td className="text-end">{formatCurrency(bill.reg_fee)}</td>
              </tr>
              <tr>
                <td>Consultation Fee</td>
                <td className="text-end">{formatCurrency(bill.doc_fee)}</td>
              </tr>
              <tr style={{ background: '#f8f9fa', fontWeight: 'bold' }}>
                <td>Total Amount</td>
                <td className="text-end" style={{ fontSize: '18px', color: '#1976d2' }}>
                  {formatCurrency(parseFloat(bill.reg_fee || 0) + parseFloat(bill.doc_fee || 0))}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Appointment Details */}
          {appointment && (
            <div className="mb-4 p-3" style={{ 
              background: '#e3f2fd', 
              borderRadius: '8px',
              border: '1px solid #bbdefb'
            }}>
              <h6 className="mb-3" style={{ color: '#1976d2' }}>Appointment Details:</h6>
              <div className="row">
                <div className="col-6">
                  <p className="mb-1"><strong>Doctor:</strong> {appointment.doctor_name || 'Dr. Assigned'}</p>
                  <p className="mb-0"><strong>Department:</strong> {appointment.department || 'General'}</p>
                </div>
                <div className="col-6">
                  <p className="mb-1"><strong>Date:</strong> {formatDate(appointment.appointment_date)}</p>
                  <p className="mb-0"><strong>Time:</strong> {appointment.appointment_time}</p>
                </div>
              </div>
              {appointment.token_no && (
                <div className="mt-3 text-center">
                  <div style={{
                    background: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    display: 'inline-block',
                    border: '2px dashed #1976d2'
                  }}>
                    <p className="mb-0 text-muted small">TOKEN NUMBER</p>
                    <h4 className="mb-0" style={{ color: '#1976d2', fontWeight: 'bold' }}>
                      {appointment.token_no}
                    </h4>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-4 pt-3 border-top">
            <p className="text-muted mb-1">Thank you for choosing Faith Multi Speciality Hospital!</p>
            <p className="text-primary mb-0" style={{ fontSize: '18px' }}>💙 Get Well Soon! 💙</p>
          </div>

          {/* Terms */}
          <div className="mt-4 pt-3 border-top">
            <p className="text-muted small mb-1"><strong>Terms & Conditions:</strong></p>
            <ul className="text-muted small mb-0 ps-3">
              <li>This is a computer-generated receipt</li>
              <li>Please bring this receipt for your appointment</li>
              <li>Fees once paid are non-refundable</li>
            </ul>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BillPreview;
