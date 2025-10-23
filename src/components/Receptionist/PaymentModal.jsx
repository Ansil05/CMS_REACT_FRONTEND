import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { FaTimes, FaCheckCircle, FaMoneyBillWave, FaCreditCard, FaMobileAlt } from 'react-icons/fa';
import QRCode from 'react-qr-code';
import Button from '../../elements/Button';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  onPaymentConfirmed, 
  amount, 
  patientName,
  paymentMode 
}) => {
  const [processing, setProcessing] = useState(false);

  // Hospital UPI Details - Update these with your actual details
  const HOSPITAL_UPI_ID = 'faithhospital@upi';
  const HOSPITAL_NAME = 'Faith Multi Speciality Hospital';

  // Generate UPI payment string
  const generateUPIString = () => {
    return `upi://pay?pa=${HOSPITAL_UPI_ID}&pn=${encodeURIComponent(HOSPITAL_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Appointment - ${patientName}`)}`;
  };

  const handleConfirmPayment = async () => {
    setProcessing(true);
    // Simulate payment confirmation delay
    setTimeout(() => {
      setProcessing(false);
      onPaymentConfirmed({
        mode: paymentMode,
        amount: amount,
        timestamp: new Date().toISOString(),
        reference: `PAY${Date.now()}`,
      });
    }, 1000);
  };

  const getPaymentIcon = () => {
    switch (paymentMode) {
      case 'UPI':
        return <FaMobileAlt size={24} className="text-primary" />;
      case 'Card':
        return <FaCreditCard size={24} className="text-info" />;
      case 'Cash':
        return <FaMoneyBillWave size={24} className="text-success" />;
      default:
        return null;
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered size="md">
      <Modal.Header style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '8px 8px 0 0'
      }}>
        <div className="d-flex align-items-center gap-2 w-100">
          {getPaymentIcon()}
          <h5 className="mb-0">Complete Payment - {paymentMode}</h5>
        </div>
        <button 
          onClick={onClose} 
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >
          <FaTimes />
        </button>
      </Modal.Header>

      <Modal.Body className="text-center py-4">
        {/* Amount Display */}
        <div className="mb-4">
          <p className="text-muted mb-1">Total Amount</p>
          <h2 className="text-primary mb-0" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            ₹{amount.toFixed(2)}
          </h2>
        </div>

        {/* UPI QR Code */}
        {paymentMode === 'UPI' && (
          <>
            <div className="d-flex justify-content-center mb-4">
              <div style={{ 
                padding: '20px', 
                background: 'white', 
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <QRCode 
                  value={generateUPIString()} 
                  size={220}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>

            <div className="alert alert-info mb-4" style={{ textAlign: 'left' }}>
              <h6 className="mb-2">📱 How to Pay:</h6>
              <ol className="mb-0 ps-3">
                <li>Open any UPI app (GPay, PhonePe, Paytm)</li>
                <li>Scan this QR code</li>
                <li>Verify amount & patient name</li>
                <li>Complete the payment</li>
              </ol>
            </div>

            <p className="text-muted small mb-3">
              <strong>UPI ID:</strong> {HOSPITAL_UPI_ID}
            </p>
          </>
        )}

        {/* Card Payment */}
        {paymentMode === 'Card' && (
          <div className="alert alert-info">
            <FaCreditCard size={48} className="mb-3 text-info" />
            <p className="mb-0">Please proceed with card payment at the counter.</p>
            <p className="text-muted small mb-0">Card machine will be used for transaction</p>
          </div>
        )}

        {/* Cash Payment */}
        {paymentMode === 'Cash' && (
          <div className="alert alert-success">
            <FaMoneyBillWave size={48} className="mb-3 text-success" />
            <p className="mb-0">Please collect ₹{amount.toFixed(2)} cash from patient.</p>
            <p className="text-muted small mb-0">Ensure you count the cash correctly</p>
          </div>
        )}

        {/* Patient Info */}
        <div className="mt-4 p-3 bg-light rounded">
          <p className="mb-1 text-muted small">Payment for</p>
          <h6 className="mb-0">{patientName}</h6>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={onClose}
          disabled={processing}
        >
          Cancel
        </Button>
        <Button 
          variant="success" 
          onClick={handleConfirmPayment}
          loading={processing}
          icon={<FaCheckCircle />}
        >
          {processing ? 'Confirming...' : 'Payment Received'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;
