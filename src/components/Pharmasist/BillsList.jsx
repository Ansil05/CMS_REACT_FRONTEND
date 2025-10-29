import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Card, Spinner, Alert } from 'react-bootstrap';
import { FaFileInvoiceDollar, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../../config/apiConfig';

const BillsList = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE}/pharmacy/bills/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) throw new Error('Failed to fetch bills');
      
      const data = await response.json();
      setBills(data.results || data);
    } catch (error) {
      console.error('Error:', error);
      showAlert('Failed to fetch bills', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  const getStatusBadge = (status) => {
    const badges = {
      'PENDING': <Badge bg="warning" text="dark">Pending</Badge>,
      'PAID': <Badge bg="success">Paid</Badge>,
      'PARTIAL': <Badge bg="info">Partial</Badge>,
      'CANCELLED': <Badge bg="danger">Cancelled</Badge>,
      'REFUNDED': <Badge bg="secondary">Refunded</Badge>,
      'OVERDUE': <Badge bg="danger">Overdue</Badge>,
    };
    return badges[status] || <Badge bg="secondary">{status}</Badge>;
  };

  if (loading) {
    return (
      <Container fluid className="p-4">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading bills...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ fontWeight: '600', color: '#2c3e50' }}>
            <FaFileInvoiceDollar className="me-2" style={{ color: '#3498db' }} />
            Pharmacy Bills
          </h2>
          <p className="text-muted mb-0">View and manage billing records</p>
        </div>
      </div>

      {/* Alert */}
      {alert.show && (
        <Alert variant={alert.type} onClose={() => setAlert({ show: false, message: '', type: '' })} dismissible>
          {alert.message}
        </Alert>
      )}

      {/* Back Button */}
      <Button 
        variant="outline-secondary"
        onClick={() => navigate('/app/pharmacist')}
        className="mb-3"
        style={{ borderRadius: '8px' }}
      >
        <FaArrowLeft className="me-2" />
        Back to Dashboard
      </Button>

      {/* Bills Table */}
      <Card style={{ border: 'none', borderRadius: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e8f4f8 100%)' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Bill #</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Patient</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Type</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Total Amount</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Paid Amount</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {bills.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <FaFileInvoiceDollar size={48} style={{ opacity: 0.3, color: '#7f8c8d' }} />
                      <p className="mt-3 text-muted mb-0">No bills found</p>
                    </td>
                  </tr>
                ) : (
                  bills.map((bill) => (
                    <tr key={bill.bill_id} style={{ transition: 'all 0.2s' }}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: '500', color: '#475569' }}>
                          {bill.serial_number}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: '#2c3e50', fontWeight: '500' }}>
                          {bill.patient_name || 'N/A'}                     
                           </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <Badge bg="primary">{bill.bill_type}</Badge>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#27ae60' }}>
                        ₹{parseFloat(bill.total_amount).toFixed(2)}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        ₹{parseFloat(bill.paid_amount).toFixed(2)}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        {getStatusBadge(bill.status)}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: '#475569' }}>
                        {new Date(bill.bill_date).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BillsList;
