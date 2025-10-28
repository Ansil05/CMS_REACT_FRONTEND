import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { 
  FaPills, 
  FaExclamationTriangle, 
  FaClock, 
  FaChartLine,
  FaBoxes,
  FaFileInvoiceDollar,
  FaShoppingCart,
<<<<<<< HEAD
  FaWarehouse
=======
  FaWarehouse,
  FaClipboardList
>>>>>>> achu
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../../config/apiConfig';

const PharmacyDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMedicines: 0,
    totalStock: 0,
    lowStockCount: 0,
    expiringSoon: 0,
    totalValue: 0,
    outOfStock: 0,
    criticalLowStock: 0,
    expiredMedicines: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
<<<<<<< HEAD
      // Get JWT token from localStorage
      const token = localStorage.getItem('token');
      
      // Fetch inventory report from your API using your API_BASE config
=======
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      
>>>>>>> achu
      const response = await fetch(`${API_BASE}/pharmacy/medicines/inventory_report/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      
      if (data) {
        const { summary, alerts } = data;
        
        setStats({
          totalMedicines: summary.total_medicines || 0,
          totalStock: summary.total_stock_units || 0,
          lowStockCount: summary.low_stock_items || 0,
          expiringSoon: summary.expiring_soon || 0,
          totalValue: summary.total_inventory_value || 0,
          outOfStock: summary.out_of_stock || 0,
          criticalLowStock: alerts.critical_low_stock || 0,
          expiredMedicines: alerts.expired_medicines || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
<<<<<<< HEAD
      // Set default values on error
=======
>>>>>>> achu
      setStats({
        totalMedicines: 0,
        totalStock: 0,
        lowStockCount: 0,
        expiringSoon: 0,
        totalValue: 0,
        outOfStock: 0,
        criticalLowStock: 0,
        expiredMedicines: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: 'Total Medicines',
      value: stats.totalMedicines,
      icon: FaPills,
      color: '#3498db',
      bgColor: '#ebf5fb',
    },
    {
      title: 'Total Stock Units',
      value: stats.totalStock.toLocaleString(),
      icon: FaBoxes,
      color: '#2ecc71',
      bgColor: '#e8f8f5',
    },
    {
      title: 'Low Stock Alert',
      value: stats.lowStockCount,
      icon: FaExclamationTriangle,
      color: '#e67e22',
      bgColor: '#fef5e7',
    },
    {
      title: 'Expiring Soon',
      value: stats.expiringSoon,
      icon: FaClock,
      color: '#f39c12',
      bgColor: '#fef9e7',
    },
    {
      title: 'Inventory Value',
      value: `₹${stats.totalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      icon: FaChartLine,
      color: '#9b59b6',
      bgColor: '#f4ecf7',
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStock,
      icon: FaWarehouse,
      color: '#e74c3c',
      bgColor: '#fadbd8',
    },
    {
      title: 'Critical Stock',
      value: stats.criticalLowStock,
      icon: FaExclamationTriangle,
      color: '#c0392b',
      bgColor: '#f2d7d5',
    },
    {
      title: 'Expired Items',
      value: stats.expiredMedicines,
      icon: FaClock,
      color: '#34495e',
      bgColor: '#ecf0f1',
    },
  ];

  if (loading) {
    return (
      <Container fluid className="p-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading dashboard data...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      <h2 className="mb-4" style={{ fontWeight: '600', color: '#2c3e50' }}>
        Pharmacy Dashboard
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
      <Row className="g-4 mb-4">
        <Col md={6} lg={3}>
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
                <FaPills size={24} color="#3498db" className="me-2" />
                <h5 className="mb-0" style={{ fontWeight: '600', color: '#2c3e50' }}>
                  Medicines
                </h5>
              </div>
              <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
                View and manage medicine inventory
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/app/pharmacist/medicines')}
                style={{
                  borderRadius: '8px',
                  padding: '10px 24px',
                  fontWeight: '500',
                }}
              >
                View Medicines
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
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
<<<<<<< HEAD
                <FaShoppingCart size={24} color="#2ecc71" className="me-2" />
=======
                <FaClipboardList size={24} color="#2ecc71" className="me-2" />
>>>>>>> achu
                <h5 className="mb-0" style={{ fontWeight: '600', color: '#2c3e50' }}>
                  Orders
                </h5>
              </div>
              <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
                Manage medicine orders and prescriptions
              </p>
              <Button
<<<<<<< HEAD
                variant="primary"
=======
                variant="success"
>>>>>>> achu
                onClick={() => navigate('/app/pharmacist/orders')}
                style={{
                  borderRadius: '8px',
                  padding: '10px 24px',
                  fontWeight: '500',
<<<<<<< HEAD
                  background: '#2ecc71',
                  border: 'none',
=======
>>>>>>> achu
                }}
              >
                View Orders
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
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
                <FaWarehouse size={24} color="#e67e22" className="me-2" />
                <h5 className="mb-0" style={{ fontWeight: '600', color: '#2c3e50' }}>
                  Inventory
                </h5>
              </div>
              <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
                Check stock levels and manage inventory
              </p>
              <Button
<<<<<<< HEAD
                variant="primary"
                onClick={() => navigate('/app/pharmacist/inventory')}
=======
                variant="warning"
                onClick={() => navigate('/app/pharmacist/medicines')}
>>>>>>> achu
                style={{
                  borderRadius: '8px',
                  padding: '10px 24px',
                  fontWeight: '500',
<<<<<<< HEAD
                  background: '#e67e22',
                  border: 'none',
=======
>>>>>>> achu
                }}
              >
                View Inventory
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
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
                <FaFileInvoiceDollar size={24} color="#9b59b6" className="me-2" />
                <h5 className="mb-0" style={{ fontWeight: '600', color: '#2c3e50' }}>
                  Bills
                </h5>
              </div>
              <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
                View and manage billing records
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/app/pharmacist/bills')}
                style={{
                  borderRadius: '8px',
                  padding: '10px 24px',
                  fontWeight: '500',
                  background: '#9b59b6',
                  border: 'none',
                }}
              >
                View Bills
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Alerts Section */}
      {(stats.criticalLowStock > 0 || stats.expiredMedicines > 0 || stats.expiringSoon > 0) && (
        <Row className="g-4">
          <Col xs={12}>
            <Card
              style={{
                border: 'none',
                borderRadius: '15px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderLeft: '4px solid #e74c3c',
              }}
            >
              <Card.Body className="p-4">
                <h5 className="mb-3" style={{ fontWeight: '600', color: '#2c3e50' }}>
                  <FaExclamationTriangle size={20} color="#e74c3c" className="me-2" />
                  Inventory Alerts
                </h5>
                <Row>
                  {stats.criticalLowStock > 0 && (
                    <Col md={4} className="mb-3">
                      <div className="d-flex align-items-center">
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background: 'rgba(231, 76, 60, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px',
                          }}
                        >
                          <FaExclamationTriangle size={20} color="#e74c3c" />
                        </div>
                        <div>
                          <p className="mb-0" style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
                            Critical Low Stock
                          </p>
                          <h6 className="mb-0" style={{ fontWeight: '600', color: '#e74c3c' }}>
                            {stats.criticalLowStock} items
                          </h6>
                        </div>
                      </div>
                    </Col>
                  )}
                  {stats.expiredMedicines > 0 && (
                    <Col md={4} className="mb-3">
                      <div className="d-flex align-items-center">
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background: 'rgba(52, 73, 94, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px',
                          }}
                        >
                          <FaClock size={20} color="#34495e" />
                        </div>
                        <div>
                          <p className="mb-0" style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
                            Expired Medicines
                          </p>
                          <h6 className="mb-0" style={{ fontWeight: '600', color: '#34495e' }}>
                            {stats.expiredMedicines} items
                          </h6>
                        </div>
                      </div>
                    </Col>
                  )}
                  {stats.expiringSoon > 0 && (
                    <Col md={4} className="mb-3">
                      <div className="d-flex align-items-center">
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background: 'rgba(243, 156, 18, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px',
                          }}
                        >
                          <FaClock size={20} color="#f39c12" />
                        </div>
                        <div>
                          <p className="mb-0" style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
                            Expiring Soon (30 days)
                          </p>
                          <h6 className="mb-0" style={{ fontWeight: '600', color: '#f39c12' }}>
                            {stats.expiringSoon} items
                          </h6>
                        </div>
                      </div>
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default PharmacyDashboard;
