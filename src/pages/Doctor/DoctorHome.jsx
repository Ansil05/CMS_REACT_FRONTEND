import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaCalendarAlt, FaFileAlt, FaUsers, FaChartLine } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getDoctorAppointments, getConsultations } from '../../services/doctorService';
import LoadingSpinner from '../../ui/LoadingSpinner';

const DoctorHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    totalConsultations: 0,
    pendingAppointments: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [appointments, consultations] = await Promise.all([
        getDoctorAppointments(),
        getConsultations(),
      ]);

      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointments.filter(app => app.date === today).length;
      const pendingAppointments = appointments.filter(app => app.status === 'Scheduled').length;

      setStats({
        totalAppointments: appointments.length,
        todayAppointments,
        totalConsultations: consultations.length,
        pendingAppointments,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      icon: FaCalendarAlt,
      color: '#3498db',
      bgColor: '#ebf5fb',
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: FaUsers,
      color: '#2ecc71',
      bgColor: '#e8f8f5',
    },
    {
      title: 'Total Consultations',
      value: stats.totalConsultations,
      icon: FaFileAlt,
      color: '#9b59b6',
      bgColor: '#f4ecf7',
    },
    {
      title: 'Pending Appointments',
      value: stats.pendingAppointments,
      icon: FaChartLine,
      color: '#e67e22',
      bgColor: '#fef5e7',
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container fluid className="p-4">
      <h2 className="mb-4" style={{ fontWeight: '600', color: '#2c3e50' }}>
        Doctor Dashboard
      </h2>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        {dashboardCards.map((card, index) => (
          <Col key={index} xs={12} sm={6} lg={3}>
            <Card
              style={{
                border: 'none',
                borderRadius: '15px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                background: card.bgColor,
                transition: 'transform 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <Card.Body className="d-flex align-items-center justify-content-between p-4">
                <div>
                  <p className="mb-1" style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                    {card.title}
                  </p>
                  <h3 style={{ color: card.color, fontWeight: 'bold', marginBottom: 0 }}>
                    {card.value}
                  </h3>
                </div>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '12px',
                    background: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <card.icon size={28} color="white" />
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Actions */}
      <Row className="g-4">
        <Col md={6}>
          <Card
            style={{
              border: 'none',
              borderRadius: '15px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              height: '100%',
            }}
          >
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <FaCalendarAlt size={24} color="#3498db" className="me-2" />
                <h5 className="mb-0" style={{ fontWeight: '600', color: '#2c3e50' }}>
                  View Appointments
                </h5>
              </div>
              <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
                View and manage your scheduled appointments
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/doctor/appointments')}
                style={{
                  borderRadius: '8px',
                  padding: '10px 24px',
                  fontWeight: '500',
                }}
              >
                View Appointments
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card
            style={{
              border: 'none',
              borderRadius: '15px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              height: '100%',
            }}
          >
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <FaFileAlt size={24} color="#9b59b6" className="me-2" />
                <h5 className="mb-0" style={{ fontWeight: '600', color: '#2c3e50' }}>
                  Consultation History
                </h5>
              </div>
              <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
                View your previous consultations and patient records
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/doctor/consultations')}
                style={{
                  borderRadius: '8px',
                  padding: '10px 24px',
                  fontWeight: '500',
                  background: '#9b59b6',
                  border: 'none',
                }}
              >
                View History
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorHome;
