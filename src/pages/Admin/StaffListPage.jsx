import React from "react";
import { Container,Row,Col } from "react-bootstrap";
import StaffContainer from "../../components/Admin/StaffContainer";

const StaffListPage = ({ fetchStats }) => {
  return (
    <Row className="mt-5">
      <Col xs= {12} className="mb-4">
      <StaffContainer fetchStats={fetchStats} />
    </Col>
    </Row>
  );
};

export default StaffListPage;
