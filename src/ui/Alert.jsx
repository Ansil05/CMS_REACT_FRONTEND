import { Alert as BSAlert } from 'react-bootstrap';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes, FaTimesCircle } from 'react-icons/fa';

const Alert = ({ 
  variant = 'info', 
  title, 
  children, 
  dismissible = false,
  onClose 
}) => {
  const icons = {
    success: FaCheckCircle,
    danger: FaTimesCircle,
    warning: FaExclamationTriangle,
    info: FaInfoCircle,
  };

  const Icon = icons[variant] || FaInfoCircle;

  return (
    <BSAlert 
      variant={variant}
      dismissible={dismissible}
      onClose={onClose}
      className="d-flex align-items-start gap-3 border-0"
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: '1rem 1.25rem'
      }}
    >
      <Icon size={20} className="mt-1 flex-shrink-0" />
      <div className="flex-grow-1">
        {title && <BSAlert.Heading className="mb-2">{title}</BSAlert.Heading>}
        {children}
      </div>
      {dismissible && onClose && (
        <button
          onClick={onClose}
          className="btn-icon"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <FaTimes size={16} />
        </button>
      )}
    </BSAlert>
  );
};

export default Alert;
