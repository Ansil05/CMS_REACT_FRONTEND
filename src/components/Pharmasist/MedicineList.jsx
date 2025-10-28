import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Badge, Modal, Alert } from 'react-bootstrap';
import { FaPills, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../../config/apiConfig';

const MedicineList = () => {
  const navigate = useNavigate();
  
  // State Management
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  // Form state
  const [formData, setFormData] = useState({
    med_code: '',
    name: '',
    manufacturer: '',
    unit_rate: '',
    stock: '',
    expiry_date: ''
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  // Fetch medicines
  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE}/pharmacy/medicines/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) throw new Error('Failed to fetch medicines');
      
      const data = await response.json();
      setMedicines(data.results || data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      showAlert('Failed to fetch medicines', 'danger');
      setLoading(false);
    }
  };

  // Add medicine
  const handleAddMedicine = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE}/pharmacy/medicines/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add medicine');
      }

      showAlert('Medicine added successfully!', 'success');
      setShowAddModal(false);
      resetForm();
      fetchMedicines();
    } catch (error) {
      console.error('Error adding medicine:', error);
      showAlert(error.message, 'danger');
    }
  };

  // Update medicine
  const handleUpdateMedicine = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE}/pharmacy/medicines/${selectedMedicine.med_id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update medicine');
      }

      showAlert('Medicine updated successfully!', 'success');
      setShowEditModal(false);
      resetForm();
      fetchMedicines();
    } catch (error) {
      console.error('Error updating medicine:', error);
      showAlert(error.message, 'danger');
    }
  };

 // Delete medicine
      const handleDeleteMedicine = async () => {
        try {
          const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
          
          const response = await fetch(`${API_BASE}/pharmacy/medicines/${selectedMedicine.med_id}/`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });

          if (!response.ok) {
            let errorMessage = 'Failed to delete medicine';
            try {
              const errorData = await response.json();
              // DRF ValidationError returns errors in various formats
              errorMessage = errorData.detail || 
                            errorData.message || 
                            (errorData.non_field_errors && errorData.non_field_errors[0]) ||
                            (typeof errorData === 'string' ? errorData : JSON.stringify(errorData)) ||
                            errorMessage;
            } catch (parseError) {
              // If response is not JSON, use default message
              console.error('Could not parse error response:', parseError);
            }
            throw new Error(errorMessage);
          }

          showAlert('Medicine deleted successfully!', 'success');
          setShowDeleteModal(false);
          setSelectedMedicine(null);
          fetchMedicines();
        } catch (error) {
          console.error('Error deleting medicine:', error);
          showAlert(error.message, 'danger');
        }
      };


  // Helper functions
  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  const resetForm = () => {
    setFormData({
      med_code: '',
      name: '',
      manufacturer: '',
      unit_rate: '',
      stock: '',
      expiry_date: ''
    });
  };

  const openEditModal = (medicine) => {
    setSelectedMedicine(medicine);
    setFormData({
      med_code: medicine.med_code,
      name: medicine.name,
      manufacturer: medicine.manufacturer,
      unit_rate: medicine.unit_rate,
      stock: medicine.stock,
      expiry_date: medicine.expiry_date
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (medicine) => {
    setSelectedMedicine(medicine);
    setShowDeleteModal(true);
  };

  const getStockBadge = (medicine) => {
    const today = new Date();
    const expiryDate = new Date(medicine.expiry_date);
    const daysToExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));

    if (expiryDate < today) {
      return <Badge bg="danger">Expired</Badge>;
    } else if (daysToExpiry <= 30) {
      return <Badge bg="warning" text="dark">Expiring Soon</Badge>;
    } else if (medicine.stock === 0) {
      return <Badge bg="danger">Out of Stock</Badge>;
    } else if (medicine.stock < 10) {
      return <Badge bg="warning" text="dark">Low Stock</Badge>;
    } else {
      return <Badge bg="success">In Stock</Badge>;
    }
  };

  // Filter medicines
  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = 
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.med_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'all') return matchesSearch;
    
    const today = new Date();
    const expiryDate = new Date(medicine.expiry_date);
    const daysToExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));

    if (filterStatus === 'low_stock') return matchesSearch && medicine.stock < 10;
    if (filterStatus === 'expiring') return matchesSearch && daysToExpiry <= 30 && daysToExpiry > 0;
    if (filterStatus === 'expired') return matchesSearch && expiryDate < today;
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <Container fluid className="p-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading medicines...</p>
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
            <FaPills className="me-2" style={{ color: '#3498db' }} />
            Medicine Inventory
          </h2>
          <p className="text-muted mb-0">Manage your medicine stock</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setShowAddModal(true)}
          style={{
            borderRadius: '8px',
            padding: '10px 24px',
            fontWeight: '500',
          }}
        >
          <FaPlus className="me-2" />
          Add New Medicine
        </Button>
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

      {/* Search and Filter */}
      <Card className="mb-4" style={{ border: 'none', borderRadius: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <div className="position-relative">
                <FaSearch 
                  style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#7f8c8d'
                  }} 
                />
                <Form.Control
                  type="text"
                  placeholder="Search by name, code, or manufacturer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '40px', borderRadius: '8px' }}
                />
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center">
                <FaFilter className="me-2" style={{ color: '#7f8c8d' }} />
                <Form.Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{ borderRadius: '8px' }}
                >
                  <option value="all">All Medicines</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="expiring">Expiring Soon</option>
                  <option value="expired">Expired</option>
                </Form.Select>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Medicine Table */}
      <Card style={{ border: 'none', borderRadius: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e8f4f8 100%)' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#2c3e50' }}>Code</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#2c3e50' }}>Name</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#2c3e50' }}>Manufacturer</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#2c3e50' }}>Unit Rate</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#2c3e50' }}>Stock</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#2c3e50' }}>Expiry Date</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#2c3e50' }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#2c3e50' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <div style={{ color: '#7f8c8d' }}>
                        <FaPills size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                        <p className="mb-0">No medicines found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMedicines.map((medicine) => (
                    <tr key={medicine.med_id} style={{ transition: 'all 0.2s' }}>
                      <td style={{ padding: '1rem 1.5rem', color: '#475569' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: '500' }}>
                          {medicine.med_code}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: '#2c3e50', fontWeight: '500' }}>
                        {medicine.name}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: '#475569' }}>
                        {medicine.manufacturer}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: '#475569' }}>
                        ₹{parseFloat(medicine.unit_rate).toFixed(2)}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{ 
                          fontWeight: '600',
                          color: medicine.stock < 10 ? '#e74c3c' : '#2ecc71'
                        }}>
                          {medicine.stock}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: '#475569' }}>
                        {new Date(medicine.expiry_date).toLocaleDateString('en-IN')}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        {getStockBadge(medicine)}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div className="d-flex gap-2">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => openEditModal(medicine)}
                            style={{ borderRadius: '6px' }}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => openDeleteModal(medicine)}
                            style={{ borderRadius: '6px' }}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Add Medicine Modal */}
      <Modal show={showAddModal} onHide={() => { setShowAddModal(false); resetForm(); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Medicine</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddMedicine}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Medicine Code *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., MED001"
                    value={formData.med_code}
                    onChange={(e) => setFormData({ ...formData, med_code: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Medicine Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Paracetamol"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Manufacturer *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Cipla Ltd."
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Unit Rate (₹) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.unit_rate}
                    onChange={(e) => setFormData({ ...formData, unit_rate: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Quantity *</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Expiry Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="secondary" onClick={() => { setShowAddModal(false); resetForm(); }}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add Medicine
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Medicine Modal */}
      <Modal show={showEditModal} onHide={() => { setShowEditModal(false); resetForm(); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Medicine</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateMedicine}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Medicine Code *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.med_code}
                    onChange={(e) => setFormData({ ...formData, med_code: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Medicine Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Manufacturer *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Unit Rate (₹) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.unit_rate}
                    onChange={(e) => setFormData({ ...formData, unit_rate: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Quantity *</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Expiry Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="secondary" onClick={() => { setShowEditModal(false); resetForm(); }}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Update Medicine
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => { setShowDeleteModal(false); setSelectedMedicine(null); }}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this medicine?</p>
          {selectedMedicine && (
            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
              <p className="mb-1"><strong>Name:</strong> {selectedMedicine.name}</p>
              <p className="mb-1"><strong>Code:</strong> {selectedMedicine.med_code}</p>
              <p className="mb-0"><strong>Manufacturer:</strong> {selectedMedicine.manufacturer}</p>
            </div>
          )}
          <Alert variant="warning" className="mt-3 mb-0">
            <small>This action cannot be undone.</small>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowDeleteModal(false); setSelectedMedicine(null); }}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteMedicine}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MedicineList;
