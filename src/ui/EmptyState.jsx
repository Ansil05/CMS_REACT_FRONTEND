import { FaInbox } from 'react-icons/fa';

const EmptyState = ({ 
  icon: Icon = FaInbox,
  title = "No data found",
  description = "There are no items to display at the moment.",
  action 
}) => {
  return (
    <div 
      className="text-center py-5"
      style={{ 
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        padding: '4rem 2rem'
      }}
    >
      <div 
        className="mx-auto mb-4 d-flex align-items-center justify-content-center"
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'var(--bg-tertiary)',
          color: 'var(--text-muted)'
        }}
      >
        <Icon size={36} />
      </div>
      
      <h4 className="fw-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h4>
      
      <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
        {description}
      </p>
      
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
