import { Alert as BSAlert } from 'react-bootstrap';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';

const Alert = ({ variant = 'info', children, dismissible = false, onClose, className = '' }) => {
  const icons = {
    success: <FaCheckCircle size={20} />,
    danger: <FaTimesCircle size={20} />,
    warning: <FaExclamationTriangle size={20} />,
    info: <FaInfoCircle size={20} />,
  };

  return (
    <BSAlert 
      variant={variant} 
      dismissible={dismissible} 
      onClose={onClose}
      className={`d-flex align-items-center gap-3 ${className}`}
      style={{
        borderRadius: 'var(--radius-lg)',
        border: 'none',
        padding: '1rem 1.5rem'
      }}
    >
      <div className="flex-shrink-0">
        {icons[variant]}
      </div>
      <div className="flex-grow-1">
        {children}
      </div>
    </BSAlert>
  );
};

export default Alert;
