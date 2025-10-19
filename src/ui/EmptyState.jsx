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
        padding: '3rem 2rem'
      }}
    >
      <div 
        className="mb-4 d-inline-flex align-items-center justify-content-center"
        style={{
          width: '80px',
          height: '80px',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--bg-tertiary)'
        }}
      >
        <Icon size={40} style={{ color: 'var(--text-muted)' }} />
      </div>
      
      <h4 className="mb-2" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h4>
      
      <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
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
