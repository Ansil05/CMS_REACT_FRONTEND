import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEye, FaFileInvoice, FaPrint } from 'react-icons/fa';
import Button from '../../elements/Button';
import SearchBar from '../../elements/SearchBar';
import Table from '../../ui/Table';
import LoadingSpinner from '../../ui/LoadingSpinner';
import EmptyState from '../../ui/EmptyState';
import { receptionistService } from '../../services/receptionistService';
import { formatDate, formatCurrency, filterArray } from '../../utils/validations';

const Billing = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadBills();
  }, []);

  useEffect(() => {
    const filtered = filterArray(
      bills,
      searchTerm,
      ['bill_id', 'patient', 'appointment']
    );
    setFilteredBills(filtered);
  }, [searchTerm, bills]);

  const loadBills = async () => {
    try {
      setLoading(true);
      const response = await receptionistService.bills.getAll();
      setBills(response.data);
      setFilteredBills(response.data);
    } catch (error) {
      console.error('Error loading bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: 'bill_id',
      header: 'Bill ID',
      render: (value) => <span className="fw-semibold">#{value}</span>,
    },
    {
      field: 'patient',
      header: 'Patient ID',
      render: (value) => `#${value}`,
    },
    {
      field: 'appointment',
      header: 'Appointment ID',
      render: (value) => `#${value}`,
    },
    {
      field: 'reg_fee',
      header: 'Registration Fee',
      render: (value) => formatCurrency(value),
    },
    {
      field: 'doc_fee',
      header: 'Consultation Fee',
      render: (value) => formatCurrency(value),
    },
    {
      field: 'total',
      header: 'Total',
      render: (value) => (
        <span className="fw-bold" style={{ color: 'var(--success-color)' }}>
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      field: 'created_at',
      header: 'Date',
      render: (value) => formatDate(value?.split('T')[0]),
    },
    {
      field: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="d-flex gap-2">
          <button
            className="table-action-btn view"
            onClick={() => navigate(`/receptionist/billing/view/${row.bill_id}`)}
            title="View Receipt"
          >
            <FaEye size={16} />
          </button>
          <button
            className="table-action-btn"
            onClick={() => window.print()}
            title="Print"
          >
            <FaPrint size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading bills..." />;
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="fw-bold mb-1">Billing</h2>
              <p className="text-muted mb-0">Manage billing records</p>
            </div>
            <Button
              variant="gradient"
              icon={<FaPlus />}
              onClick={() => navigate('/receptionist/billing/add')}
            >
              Generate Bill
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by bill ID, patient ID..."
          />
        </Col>
        <Col md={6} className="text-md-end mt-3 mt-md-0">
          <span className="text-muted">
            Showing {filteredBills.length} of {bills.length} bills
          </span>
        </Col>
      </Row>

      <Row>
        <Col>
          {filteredBills.length > 0 ? (
            <Table
              columns={columns}
              data={filteredBills}
              striped
              hover
              emptyMessage="No bills found"
            />
          ) : (
            <EmptyState
              icon={FaFileInvoice}
              title="No Bills Found"
              description={
                searchTerm
                  ? 'Try adjusting your search criteria'
                  : 'Get started by generating your first bill'
              }
              action={
                !searchTerm && (
                  <Button
                    variant="gradient"
                    icon={<FaPlus />}
                    onClick={() => navigate('/receptionist/billing/add')}
                  >
                    Generate First Bill
                  </Button>
                )
              }
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Billing;
