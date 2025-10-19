import { Component } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import Button from '../elements/Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="d-flex align-items-center justify-content-center min-vh-100"
          style={{ background: 'var(--bg-secondary)' }}
        >
          <div className="text-center" style={{ maxWidth: '500px', padding: '2rem' }}>
            <div 
              className="mb-4 mx-auto d-flex align-items-center justify-content-center"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'rgba(244, 67, 54, 0.1)'
              }}
            >
              <FaExclamationTriangle size={48} color="#f44336" />
            </div>
            
            <h2 className="mb-3 fw-bold">Oops! Something went wrong</h2>
            <p className="text-muted mb-4">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            
            <Button 
              variant="gradient"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
