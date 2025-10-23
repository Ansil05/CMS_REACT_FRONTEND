import React from "react";
import { Table } from "react-bootstrap";

const StaffTable = ({ staffs }) => {
  return (
    <Table striped bordered hover responsive>
      <thead className="table-dark">
        <tr>
          <th>Staff ID</th>
          <th>Name</th>
          <th>DOB</th>
          <th>Gender</th>
          <th>Role</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Active</th>
        </tr>
      </thead>
      <tbody>
        {staffs.map((staff) => (
          <tr key={staff.StaffId}>
            <td>{staff.StaffId}</td>
            <td>{staff.FirstName} {staff.LastName}</td>
            <td>{staff.DOB}</td>
            <td>{staff.Gender}</td>
            <td>{staff.Role?.name || "N/A"}</td>
            <td>{staff.Email}</td>
            <td>{staff.PhoneNumber}</td>
            <td>{staff.IsActive ? "✅" : "❌"}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default StaffTable;
