import { Modal } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';
import Button from '../elements/Button';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false
}) => {
  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Body className="text-center p-5">
        <div 
          className="mx-auto mb-4 d-flex align-items-center justify-content-center"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: variant === 'danger' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(255, 152, 0, 0.1)'
          }}
        >
          <FaExclamationTriangle 
            size={36} 
            color={variant === 'danger' ? '#f44336' : '#ff9800'} 
          />
        </div>
        
        <h4 className="fw-bold mb-3">{title}</h4>
        <p className="text-muted mb-4">{message}</p>
        
        <div className="d-flex gap-3 justify-content-center">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmModal;
