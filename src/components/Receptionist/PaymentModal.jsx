import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { FaTimes, FaCheckCircle, FaCreditCard, FaMoneyBillWave, FaMobileAlt } from 'react-icons/fa';
import Button from '../../elements/Button';
import QRCode from 'react-qr-code';

const HOSPITAL_UPI_ID = 'faithhospital@upi';

const PaymentModal = ({ show, onHide, onPaymentConfirmed, amount, patientName, paymentMode }) => {
  const [confirming, setConfirming] = useState(false);

  const handleConfirmPayment = () => {
    setConfirming(true);
    
    const paymentDetails = {
      mode: paymentMode,
      reference: `TXN${Date.now()}`,
      timestamp: new Date().toISOString(),
      amount: amount
    };

    setTimeout(() => {
      onPaymentConfirmed(paymentDetails);
      setConfirming(false);
      onHide();
    }, 1000);
  };

  const renderPaymentContent = () => {
    switch (paymentMode) {
      case 'UPI':
        return (
          <div className="text-center">
            <FaMobileAlt size={40} className="text-primary mb-3" />
            <h5>Scan QR Code</h5>
            <div className="d-flex justify-content-center my-4">
              <div className="p-3 bg-white border rounded">
                <QRCode value={`upi://pay?pa=${HOSPITAL_UPI_ID}&pn=FaithHospital&am=${amount}&cu=INR`} size={200} />
              </div>
            </div>
            <p className="text-muted small">Scan this QR code using any UPI app</p>
            <p className="text-muted small">(Google Pay, PhonePe, Paytm, etc.)</p>
          </div>
        );

      case 'Card':
        return (
          <div className="text-center">
            <FaCreditCard size={40} className="text-info mb-3" />
            <h5>Card Payment</h5>
            <p className="my-4">Please proceed with card payment at the counter.</p>
            <div className="alert alert-info">
              <small>Swipe/Insert/Tap your card on POS machine</small>
            </div>
          </div>
        );

      case 'Cash':
        return (
          <div className="text-center">
            <FaMoneyBillWave size={40} className="text-success mb-3" />
            <h5>Cash Payment</h5>
            <div className="my-4">
              <h3 className="text-success">₹{amount.toFixed(2)}</h3>
              <p className="text-muted">Please collect cash from patient</p>
            </div>
          </div>
        );

      case 'Cheque':
        return (
          <div className="text-center">
            <FaCheckCircle size={40} className="text-warning mb-3" />
            <h5>Cheque Payment</h5>
            <p className="my-4">Please collect cheque from patient and verify details.</p>
            <div className="alert alert-warning">
              <small>Verify: Bank name, Account number, Signature, Date</small>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Complete Payment - {paymentMode}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-3">
          <p><strong>Patient:</strong> {patientName}</p>
          <p><strong>Amount:</strong> ₹{amount.toFixed(2)}</p>
        </div>
        <hr />
        {renderPaymentContent()}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} icon={<FaTimes />}>
          Cancel
        </Button>
        <Button 
          variant="success" 
          onClick={handleConfirmPayment} 
          loading={confirming}
          icon={<FaCheckCircle />}
        >
          {confirming ? 'Processing...' : 'Confirm Payment'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;
