import React from "react";
import { Container,Row,Col } from "react-bootstrap";
import DoctorContainer from "../../components/Admin/DoctorContainer";

const DoctorListPage = () => {
  return (
    <Row className="mt-5">
      <Col xs= {12} className="mb-4">
        <DoctorContainer />
      </Col>
    </Row>
  );
};

export default DoctorListPage;