import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  FaUserPlus,
  FaUsers,
  FaCalendarPlus,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaMobileAlt,
  FaCreditCard,
  FaCalendarCheck,
  FaChartLine,
  FaClock,
  FaExclamationTriangle
} from 'react-icons/fa';
import { receptionistService } from '../../services/receptionistService';
import LoadingSpinner from '../../ui/LoadingSpinner';
import PatientSearchBar from '../../components/Receptionist/PatientSearchBar';
import { formatCurrency, isToday, getGreeting } from '../../utils/validations';

const ReceptionistHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    todayRevenue: 0,
    cashCollection: 0,
    upiCollection: 0,
    cardCollection: 0,
    pendingBills: 0,
    totalPatients: 0,
    recentAppointments: []
  });

  useEffect(() => {
    loadDashboardStats();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadDashboardStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);

      // Load bills for today's revenue
      const billsResponse = await receptionistService.bills.getAll();
      const allBills = billsResponse.data || [];

      // Filter today's bills
      const todayBills = allBills.filter(bill => 
        isToday(bill.created_at || bill.date)
      );

      // Calculate revenue
      const todayRevenue = todayBills.reduce((sum, bill) => 
        sum + parseFloat(bill.reg_fee || 0) + parseFloat(bill.doc_fee || 0), 0
      );

      // Calculate payment mode collections
      const cashCollection = todayBills
        .filter(bill => bill.payment_mode === 'Cash')
        .reduce((sum, bill) => sum + parseFloat(bill.reg_fee || 0) + parseFloat(bill.doc_fee || 0), 0);

      const upiCollection = todayBills
        .filter(bill => bill.payment_mode === 'UPI')
        .reduce((sum, bill) => sum + parseFloat(bill.reg_fee || 0) + parseFloat(bill.doc_fee || 0), 0);

      const cardCollection = todayBills
        .filter(bill => bill.payment_mode === 'Card')
        .reduce((sum, bill) => sum + parseFloat(bill.reg_fee || 0) + parseFloat(bill.doc_fee || 0), 0);

      // Load appointments
      const appointmentsResponse = await receptionistService.appointments.getAll();
      const allAppointments = appointmentsResponse.data || [];
      const todayAppointments = allAppointments.filter(apt => 
        isToday(apt.appointment_date)
      );

      // Load patients
      const patientsResponse = await receptionistService.patients.getAll();
      const totalPatients = patientsResponse.data?.length || 0;

      // Get recent appointments (last 5)
      const recentAppointments = [...todayAppointments]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

      setStats({
        todayAppointments: todayBills.length,
        todayRevenue,
        cashCollection,
        upiCollection,
        cardCollection,
        pendingBills: 0, // Can be calculated if you have pending status
        totalPatients,
        recentAppointments
      });

    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: 'Add Patients',
      description: 'Register new patients quickly',
      icon: FaUserPlus,
      color: '#1e88e5',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      path: '/app/receptionist/patients/add',
    },
    {
      title: 'View Patients',
      description: 'Manage patient records',
      icon: FaUsers,
      color: '#26a69a',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      path: '/app/receptionist/patients',
    },
    {
      title: 'Book Appointments',
      description: 'Schedule and generate bills',
      icon: FaCalendarPlus,
      color: '#ec407a',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      path: '/app/receptionist/appointments/add',
    },
    {
      title: 'Bill Reports',
      description: 'View billing records',
      icon: FaFileInvoiceDollar,
      color: '#ffa726',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      path: '/app/receptionist/billing',
    },
  ];

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <Container fluid className="py-4">
      {/* Welcome Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="mb-1 fw-bold">{getGreeting()}! 👋</h2>
              <p className="text-muted mb-0">Here's what's happening with your clinic today</p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <FaClock className="text-muted" />
              <span className="text-muted">
                {new Date().toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </Col>
      </Row>

      {/* Patient Search Bar */}
      <Row className="mb-4">
        <Col lg={6}>
          <PatientSearchBar />
        </Col>
      </Row>

      {/* Revenue Stats Cards */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1 opacity-90" style={{ fontSize: '0.875rem' }}>Today's Revenue</p>
                  <h3 className="mb-0 fw-bold">{formatCurrency(stats.todayRevenue)}</h3>
                </div>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaChartLine size={24} />
                </div>
              </div>
              <div className="mt-3 d-flex align-items-center gap-2">
                <FaCalendarCheck size={14} />
                <small>{stats.todayAppointments} appointments today</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100" style={{ 
            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            color: 'white'
          }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1 opacity-90" style={{ fontSize: '0.875rem' }}>Cash Collection</p>
                  <h3 className="mb-0 fw-bold">{formatCurrency(stats.cashCollection)}</h3>
                </div>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaMoneyBillWave size={24} />
                </div>
              </div>
              <div className="mt-3">
                <small>
                  {Math.round((stats.cashCollection / stats.todayRevenue) * 100) || 0}% of total
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100" style={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1 opacity-90" style={{ fontSize: '0.875rem' }}>UPI Collection</p>
                  <h3 className="mb-0 fw-bold">{formatCurrency(stats.upiCollection)}</h3>
                </div>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaMobileAlt size={24} />
                </div>
              </div>
              <div className="mt-3">
                <small>
                  {Math.round((stats.upiCollection / stats.todayRevenue) * 100) || 0}% of total
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100" style={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white'
          }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1 opacity-90" style={{ fontSize: '0.875rem' }}>Card Collection</p>
                  <h3 className="mb-0 fw-bold">{formatCurrency(stats.cardCollection)}</h3>
                </div>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaCreditCard size={24} />
                </div>
              </div>
              <div className="mt-3">
                <small>
                  {Math.round((stats.cardCollection / stats.todayRevenue) * 100) || 0}% of total
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <h5 className="mb-3 fw-semibold">Quick Actions</h5>
        </Col>
      </Row>

      <Row className="g-4">
        {dashboardCards.map((card, index) => (
          <Col key={index} xs={12} sm={6} lg={3}>
            <Card
              className="dashboard-card h-100 shadow-sm"
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: 'none',
                background: card.gradient,
                color: 'white'
              }}
              onClick={() => navigate(card.path)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <Card.Body className="d-flex flex-column justify-content-center text-center p-4">
                <div className="mb-3">
                  <card.icon size={48} />
                </div>
                <h5 className="mb-2 fw-bold">{card.title}</h5>
                <p className="mb-0 opacity-90 small">{card.description}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recent Appointments */}
      {stats.recentAppointments.length > 0 && (
        <Row className="mt-5">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 p-4">
                <h5 className="mb-0 fw-semibold">
                  <FaCalendarCheck className="me-2 text-primary" />
                  Recent Appointments
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead style={{ background: '#f8f9fa' }}>
                      <tr>
                        <th className="px-4">Patient</th>
                        <th>Doctor</th>
                        <th>Time</th>
                        <th>Token</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentAppointments.map((apt, index) => (
                        <tr key={index}>
                          <td className="px-4">{apt.patient_name || 'N/A'}</td>
                          <td>{apt.doctor_name || 'Dr. Assigned'}</td>
                          <td>{apt.appointment_time || 'N/A'}</td>
                          <td>
                            <span className="badge bg-primary">
                              {apt.token_no || 'TKN' + (index + 1)}
                            </span>
                          </td>
                          <td className="fw-bold text-success">
                            {formatCurrency(apt.total_amount || 500)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ReceptionistHome;
