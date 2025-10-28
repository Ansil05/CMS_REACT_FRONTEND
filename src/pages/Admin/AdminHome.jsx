import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaUserMd, FaCalendarAlt, FaUsers, FaUserShield } from 'react-icons/fa';
import LoadingSpinner from '../../ui/LoadingSpinner';
import StaffListPage from './StaffListPage';
import api from '../../services/api';
import SpecializationListPage from './SpecializationListPage';

const AdminHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    staffs: 0,
    roles: 0,
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('dashboard/stats/');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  const dashboardCards = [
    {
      title: 'Patients',
      description: `${stats.patients} total patients`,
      icon: <FaUserPlus size={32} className="mb-2" color="#fff" />,
      gradient: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
    },
    {
      title: 'Doctors',
      description: `${stats.doctors} total doctors`,
      icon: <FaUserMd size={32} className="mb-2" color="#fff" />,
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    },
    {
      title: 'Appointments',
      description: `${stats.appointments} total appointments`,
      icon: <FaCalendarAlt size={32} className="mb-2" color="#fff" />,
      gradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
    },
    {
      title: 'Staffs',
      description: `${stats.staffs} total staffs`,
      icon: <FaUsers size={32} className="mb-2" color="#fff" />,
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    },
    {
      title: 'Roles',
      description: `${stats.roles} total roles`,
      icon: <FaUserShield size={32} className="mb-2" color="#fff" />,
      gradient: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
    },
  ];

  return (
    <Container fluid className="py-4 px-3 px-md-5">
      {/* Header */}
      <Row className="justify-content-center text-center mb-4">
        <Col xs={12} md={8}>
          <h1 className="fw-bold mb-2" style={{ fontSize: '2rem', color: '#064e3b' }}>
            Admin Dashboard
          </h1>
          <p className="text-muted mb-0" style={{ fontSize: '1rem' }}>
            Manage staffs, users, and system operations efficiently
          </p>
        </Col>
      </Row>

      {/* Dashboard Cards */}
      <Row className="g-3 justify-content-center">
        {dashboardCards.map((card, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={3} xl={2}>
            <Card
              className="border-0 shadow-sm h-100 text-center card-hover"
              style={{
                background: card.gradient,
                color: '#fff',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
             
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Card.Body className="p-4 d-flex flex-column align-items-center justify-content-center">
                {card.icon}
                <h5 className="fw-semibold mt-2">{card.title}</h5>
                <p className="small text-light mb-0">{card.description}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Staff List Section */}
      <Row className="mt-5">
        <Col xs={12}>
          <Card className="shadow-sm border-0 p-3 p-md-4" style={{ borderTop: '4px solid #16a34a' }}>
            <StaffListPage fetchStats={fetchStats} />
            <SpecializationListPage />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminHome;
