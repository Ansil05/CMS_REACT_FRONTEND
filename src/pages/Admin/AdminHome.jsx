import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  FaUserPlus, FaUsers,
} from 'react-icons/fa';
import { IoMdSettings } from "react-icons/io";
import LoadingSpinner from '../../ui/LoadingSpinner';
import StaffListPage from './StaffListPage';
import DoctorListPage from './DoctorListPage';

const AdminHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [counts, setCounts] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    staffs: 0,
    roles: 0,
  });

  useEffect(() => {
    let mounted = true;
    const fetchCounts = async () => {
      setLoading(true);
      try {
        const { default: api } = await import('../../services/api'); // Adjust the path as necessary
        const res = await api.get('/admin/counts');
        if (!res.status === 200) throw new Error('Failed to fetch counts');
        const data = res.data;
        if (!mounted) return;
        setCounts({
          patients: data.patients ?? 0,
          doctors: data.doctors ?? 0,
          appointments: data.appointments ?? 0,
          staffs: data.staffs ?? 0,
          roles: data.roles ?? 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchCounts();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <LoadingSpinner />;

  const dashboardCards = [
    {
      title: 'Patients',
      description: `${counts.patients} total patients`,
      icon: FaUserPlus,
      color: '#1e88e5',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      title: 'Doctors',
      description: `${counts.doctors} total doctors`,
      color: '#26a69a',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    },
    {
      title: 'Appointments',
      description: `${counts.appointments} total appointments`,
      color: '#fb8c00',
      gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    },
    {
      title: 'Staffs',
      description: `${counts.staffs} total staffs`,
      color: '#42a5f5',
      gradient: 'linear-gradient(135deg, #667eea 0%, #42a5f5 100%)',
    },
    {
      title: 'Roles',
      description: `${counts.roles} total roles`,
      color: '#ab47bc',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
  ];

  return (
    <Container fluid className='py-4'>
      {/* Header */}
      <Row className="justify-content-center text-center mb-5">
        <Col md={8}>
        <h1 
          className="fw-bold mb-3" 
          style={{ 
            fontSize: '2.5rem',
            color: 'var(--primary-600)'
          }}
        >
          ADMIN DASHBOARD
        </h1>
        <p className="text-muted" style={{ fontSize: '1.125rem' }}>
          Manage Staffs, Users, and System
        </p>
        </Col>
      </Row>

      {/* Dashboard Cards */}
      <Row className="g-4 justify-content-center stagger-animation">
        {dashboardCards.map((card, index) => (
          <Col xs={12} md={3} sm={6} lg={3} key={index}>
            <Card 
              className="border-0 shadow-sm card-hover h-100 text-center curved-card"
              style={{ 
                cursor: 'pointer', 
                borderRadius: 'var(--radius-xl)',
                background: card.gradient,
                transition: 'all 0.3s ease'
              }}
            >
              <Card.Body className="p-4 text-center">
              
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
      <Row className="g-4 justify-content-center stagger-animation">
        <Col xs={8} sm={10} lg={12} className="mt-5">
        <StaffListPage />
        </Col>
      </Row>
      {/* <Row className="g-4 justify-content-center stagger-animation">
        <Col xs={8} sm={10} lg={12} className="mt-5">
        <DoctorListPage />
        </Col>
      </Row> */}
    </Container>
  );
};

export default AdminHome;
