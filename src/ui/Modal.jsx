import { Modal as BSModal } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'lg',
  footer,
  headerGradient = false 
}) => {
  return (
    <BSModal 
      show={isOpen} 
      onHide={onClose} 
      size={size}
      centered
      backdrop="static"
    >
      <BSModal.Header 
        className="border-0"
        style={{
          background: headerGradient ? 'var(--gradient-primary)' : 'white',
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0'
        }}
      >
        <BSModal.Title 
          className="fw-semibold"
          style={{ 
            color: headerGradient ? 'white' : 'var(--text-primary)',
            fontSize: 'var(--font-size-xl)'
          }}
        >
          {title}
        </BSModal.Title>
        <button
          onClick={onClose}
          className="btn-icon"
          style={{
            background: headerGradient ? 'rgba(255,255,255,0.2)' : 'var(--bg-light)',
            color: headerGradient ? 'white' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <FaTimes size={18} />
        </button>
      </BSModal.Header>
      
      <BSModal.Body style={{ padding: '1.5rem' }}>
        {children}
      </BSModal.Body>
      
      {footer && (
        <BSModal.Footer 
          className="border-0"
          style={{ 
            padding: '1rem 1.5rem 1.5rem',
            background: 'var(--bg-light)'
          }}
        >
          {footer}
        </BSModal.Footer>
      )}
    </BSModal>
  );
};

export default Modal;
