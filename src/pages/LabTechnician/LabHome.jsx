import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  FaUserPlus, FaUsers, FaCalendarPlus, FaFileInvoiceDollar 
} from 'react-icons/fa';

import LoadingSpinner from '../../ui/LoadingSpinner';

const LabHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const dashboardCards = [
    {
      title: 'Test Lists',
      description: 'View differnt tests',
      icon: FaUserPlus,
      color: '#1e88e5',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      path: '/receptionist/patients/add',
    },
    {
      title: 'Test Requests',
      description: 'View, update, and manage patient lab tests',
      icon: FaUsers,
      color: '#26a69a',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      path: '/receptionist/patients',
    },
    {
      title: 'Test Results',
      description: 'Expected outcome of the measurement',
      icon: FaCalendarPlus,
      color: '#42a5f5',
      gradient: 'linear-gradient(135deg, #667eea 0%, #42a5f5 100%)',
      path: '/receptionist/appointments/add',
    },
    {
      title: 'Test bill',
      description: 'Generate and manage billing records',
      icon: FaFileInvoiceDollar,
      color: '#ab47bc',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      path: '/receptionist/billing/add',
    },
  ];

  return (
    <Container fluid>
      {/* Header */}
      <div className="text-center mb-5">
        <h1 
          className="fw-bold mb-3" 
          style={{ 
            fontSize: '2.5rem',
            color: 'var(--primary-600)'
          }}
        >
          LABORATORY DASHBOARD
        </h1>
        <p className="text-muted" style={{ fontSize: '1.125rem' }}>
          Manage  and evaluvate lab tests...
        </p>
      </div>

      {/* Dashboard Cards */}
      <Row className="g-4 justify-content-center stagger-animation">
        {dashboardCards.map((card, index) => (
          <Col xs={12} sm={6} lg={3} key={index}>
            <Card 
              className="border-0 shadow-sm card-hover h-100"
              onClick={() => navigate(card.path)}
              style={{ 
                cursor: 'pointer', 
                borderRadius: 'var(--radius-xl)',
                background: 'white',
                transition: 'all 0.3s ease'
              }}
            >
              <Card.Body className="p-4 text-center">
                {/* Icon */}
                <div 
                  className="mx-auto mb-4 d-flex align-items-center justify-content-center"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: 'var(--radius-xl)',
                    background: card.gradient,
                    boxShadow: `0 8px 16px ${card.color}40`
                  }}
                >
                  <card.icon size={36} color="white" />
                </div>

                {/* Title */}
                <h5 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {card.title}
                </h5>

                {/* Description */}
                <p 
                  className="text-muted mb-0" 
                  style={{ fontSize: '0.875rem', lineHeight: '1.5' }}
                >
                  {card.description}
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default LabHome;
