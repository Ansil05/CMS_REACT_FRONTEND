import React from "react";
import { Container } from "react-bootstrap";
import StaffContainer from "../../components/Admin/StaffContainer";

const StaffListPage = () => {
  return (
    <Container className="mt-4">
      <h3 className="mb-4 text-center">Staff List</h3>
      <StaffContainer />
    </Container>
  );
};

export default StaffListPage;
