import React from "react";
import { Table, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

const StaffTable = ({ staffs, onEdit, onDelete }) => {
  return (
    <Table className="table-striped table-bordered table-hover" responsive>
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
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {staffs.map((staff) => (
          <tr key={staff.StaffId}>
            <td>{staff.StaffId}</td>
            <td>{staff.FirstName} {staff.LastName}</td>
            <td>{staff.DOB}</td>
            <td>{staff.Gender}</td>
            <td>{staff.RoleDetail?.RoleName || "N/A"}</td>
            <td>{staff.Email}</td>
            <td>{staff.PhoneNumber}</td>
            <td>{staff.IsActive ? "✅" : "❌"}</td>
            <td>
              <Button
                variant="warning"
                size="sm"
                className="me-2"
                onClick={() => onEdit(staff)}
              >
                <FaEdit />
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(staff.StaffId, staff.Email)}
              >
                <FaTrash />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default StaffTable;
