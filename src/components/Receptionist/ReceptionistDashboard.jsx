import { Row, Col } from 'react-bootstrap';
import StatCard from '../../ui/StatCard';

const ReceptionistDashboard = ({ stats }) => {
  return (
    <Row className="g-4">
      <Col xs={12} sm={6} lg={3}>
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon="FaUsers"
          color="blue"
          subtitle="Registered patients"
        />
      </Col>
      <Col xs={12} sm={6} lg={3}>
        <StatCard
          title="Appointments Today"
          value={stats.appointmentsToday}
          icon="FaCalendar"
          color="green"
          subtitle="Scheduled for today"
        />
      </Col>
      <Col xs={12} sm={6} lg={3}>
        <StatCard
          title="Bills Generated"
          value={stats.billsGenerated}
          icon="FaFileInvoice"
          color="purple"
          subtitle="Today"
        />
      </Col>
      <Col xs={12} sm={6} lg={3}>
        <StatCard
          title="Revenue Today"
          value={`₹${stats.revenueToday.toFixed(2)}`}
          icon="FaDollarSign"
          color="orange"
          subtitle="Total revenue"
        />
      </Col>
    </Row>
  );
};

export default ReceptionistDashboard;
