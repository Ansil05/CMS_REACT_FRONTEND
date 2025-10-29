import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaFileInvoice, FaPrint, FaSearch, FaMoneyBillWave, FaCreditCard, FaMobileAlt } from 'react-icons/fa';
import Button from '../../elements/Button';
import SearchBar from '../../elements/SearchBar';
import Table from '../../ui/Table';
import LoadingSpinner from '../../ui/LoadingSpinner';
import EmptyState from '../../ui/EmptyState';
import Badge from '../../elements/Badge';
import { receptionistService } from '../../services/receptionistService';
import { formatDate, formatCurrency, filterArray } from '../../utils/validations';

const BillReports = () => {
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
      ['bill_id', 'patient_name', 'payment_mode']
    );
    setFilteredBills(filtered);
  }, [searchTerm, bills]);

  const loadBills = async () => {
    try {
      setLoading(true);
      const response = await receptionistService.bills.getAll();
      setBills(response.data || []);
      setFilteredBills(response.data || []);
    } catch (err) {
      console.error('Failed to load bills:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBill = (billId) => {
    navigate(`/app/receptionist/billing/${billId}`);
  };

  const getPaymentModeIcon = (mode) => {
    const icons = {
      'Cash': <FaMoneyBillWave className="text-success" />,
      'UPI': <FaMobileAlt className="text-primary" />,
      'Card': <FaCreditCard className="text-info" />,
      'Cheque': <FaMoneyCheck className="text-warning" />
    };
    return icons[mode] || <FaMoneyBillWave />;
  };

  const getPaymentBadgeVariant = (mode) => {
    const variants = {
      'Cash': 'success',
      'UPI': 'primary',
      'Card': 'info',
      'Cheque': 'warning'
    };
    return variants[mode] || 'secondary';
  };

  const columns = [
    {
      header: 'Bill ID',
      accessor: 'bill_id',
      render: (row) => (
        <strong className="text-primary">#{row.bill_id}</strong>
      )
    },
    {
      header: 'Patient Name',
      accessor: 'patient_name',
      render: (row) => row.patient_name || 'N/A'
    },
    {
      header: 'Date',
      accessor: 'created_at',
      render: (row) => formatDate(row.created_at)
    },
    {
      header: 'Reg. Fee',
      accessor: 'reg_fee',
      render: (row) => formatCurrency(row.reg_fee)
    },
    {
      header: 'Consult. Fee',
      accessor: 'doc_fee',
      render: (row) => formatCurrency(row.doc_fee)
    },
    {
      header: 'Total Amount',
      accessor: 'total',
      render: (row) => (
        <strong className="text-success">
          {formatCurrency(parseFloat(row.reg_fee || 0) + parseFloat(row.doc_fee || 0))}
        </strong>
      )
    },
    {
      header: 'Payment Mode',
      accessor: 'payment_mode',
      render: (row) => (
        <div className="d-flex align-items-center gap-2">
          {getPaymentModeIcon(row.payment_mode)}
          <Badge variant={getPaymentBadgeVariant(row.payment_mode)}>
            {row.payment_mode}
          </Badge>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'payment_status',
      render: (row) => (
        <Badge variant={row.payment_status === 'PAID' ? 'success' : 'warning'}>
          {row.payment_status || 'PAID'}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="d-flex gap-2">
          <Button
            variant="info"
            size="sm"
            icon={<FaEye />}
            onClick={() => handleViewBill(row.id)}
          >
            View
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<FaPrint />}
            onClick={() => window.print()}
          >
            Print
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading bill reports..." />;
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <FaFileInvoice className="me-2 text-primary" />
                Bill Reports
              </h2>
              <p className="text-muted mb-0">View and search all billing records</p>
            </div>
            <div className="d-flex gap-2">
              <Badge variant="primary" className="fs-6 px-3 py-2">
                Total Bills: {bills.length}
              </Badge>
              <Badge variant="success" className="fs-6 px-3 py-2">
                Total Revenue: {formatCurrency(
                  bills.reduce((sum, bill) => 
                    sum + parseFloat(bill.reg_fee || 0) + parseFloat(bill.doc_fee || 0), 0
                  )
                )}
              </Badge>
            </div>
          </div>
        </Col>
      </Row>

      {/* Search Bar */}
      <Row className="mb-4">
        <Col md={6}>
          <SearchBar
            placeholder="Search by bill ID, patient name, or payment mode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<FaSearch />}
          />
        </Col>
      </Row>

      {/* Bills Table */}
      <Row>
        <Col>
          {filteredBills.length > 0 ? (
            <Table
              columns={columns}
              data={filteredBills}
              striped
              hover
            />
          ) : (
            <EmptyState
              icon={FaFileInvoice}
              title="No bills found"
              description="No billing records match your search criteria"
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default BillReports;
