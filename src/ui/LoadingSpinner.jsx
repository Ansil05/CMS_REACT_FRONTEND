import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ fullScreen = false, message = "Loading..." }) => {
  if (fullScreen) {
    return (
      <div 
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}
      >
        <div className="position-relative mb-3">
          <Spinner 
            animation="border" 
            style={{ 
              width: '3rem', 
              height: '3rem',
              color: 'var(--primary-600)',
              borderWidth: '4px'
            }} 
          />
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-base)' }}>
          {message}
        </p>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center gap-2">
      <Spinner 
        animation="border" 
        size="sm"
        style={{ color: 'var(--primary-600)' }}
      />
      <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
        {message}
      </span>
    </div>
  );
};

export default LoadingSpinner;
