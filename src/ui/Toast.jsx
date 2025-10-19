import { Toast as BSToast, ToastContainer } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

const Toast = ({ show, onClose, variant = 'success', message, title, position = 'top-end' }) => {
  const icons = {
    success: <FaCheckCircle size={20} />,
    danger: <FaTimesCircle size={20} />,
    warning: <FaExclamationTriangle size={20} />,
    info: <FaInfoCircle size={20} />,
  };

  const bgColors = {
    success: 'var(--success-color)',
    danger: 'var(--danger-color)',
    warning: 'var(--warning-color)',
    info: 'var(--info-color)',
  };

  return (
    <ToastContainer position={position} className="p-3" style={{ zIndex: 9999 }}>
      <BSToast 
        show={show} 
        onClose={onClose} 
        delay={3000} 
        autohide
        style={{
          minWidth: '300px',
          borderRadius: 'var(--radius-lg)',
          border: 'none',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <BSToast.Header 
          style={{ 
            background: bgColors[variant],
            color: 'white',
            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
            border: 'none'
          }}
        >
          <div className="d-flex align-items-center gap-2 me-auto">
            {icons[variant]}
            <strong>{title || variant.charAt(0).toUpperCase() + variant.slice(1)}</strong>
          </div>
        </BSToast.Header>
        <BSToast.Body style={{ padding: '1rem' }}>
          {message}
        </BSToast.Body>
      </BSToast>
    </ToastContainer>
  );
};

export default Toast;
