import React from "react";
import { Table, Button, Badge } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

const StaffTable = ({ staffs, onEdit, onDelete }) => {
  return (
    <div className="table-responsive">
      <Table
        striped
        bordered
        hover
        className="shadow-sm align-middle text-center"
        style={{
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <thead style={{ backgroundColor: "#15803d", color: "white" }}>
          <tr>
            <th>Staff ID</th>
            <th>Name</th>
            <th>DOB</th>
            <th>Gender</th>
            <th>Role</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffs.map((staff) => (
            <tr key={staff.StaffId}>
              <td>{staff.StaffId}</td>
              <td>
                {staff.FirstName} {staff.LastName}
              </td>
              <td>{staff.DOB}</td>
              <td>{staff.Gender}</td>
              <td>{staff.RoleDetail?.RoleName || "N/A"}</td>
              <td>{staff.Email}</td>
              <td>{staff.PhoneNumber}</td>
              <td>
                {staff.IsActive ? (
                  <Badge bg="success" pill>
                    Active
                  </Badge>
                ) : (
                  <Badge bg="danger" pill>
                    Inactive
                  </Badge>
                )}
              </td>
              <td>
                <Button
                  variant="outline-success"
                  size="sm"
                  className="me-2"
                  onClick={() => onEdit(staff)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="outline-danger"
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
    </div>
  );
};

export default StaffTable;
