import React from "react";
import { Table, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

const DoctorTable = ({ doctors, onEdit, onDelete }) => {
  return (
    <Table className="table-striped table-bordered table-hover" responsive>
      <thead className="table-dark">
        <tr>
          <th>Doctor ID</th>
          <th>Name</th>
          <th>Specialization</th>
          <th>Years Of Experience</th>
        </tr>
      </thead>
      <tbody>
        {doctors.map((doctor) => (
          <tr key={doctor.DoctorId}>
            <td>{doctor.DoctorId}</td>
            <td>{doctor.StaffDetail.FirstName} {doctor.StaffDetail.LastName}</td>
            <td>{doctor.SpecializationDetails?.SpecializationName || "N/A"}</td>
            <td>{doctor.YearsOfExperience || 0}</td>
            {/* <td>
              <Button
                variant="warning"
                size="sm"
                className="me-2"
                // onClick={() => onEdit(doctor)}
              >
                <FaEdit />
              </Button>
              <Button
                variant="danger"
                size="sm"
                // onClick={() => onDelete(doctor.DoctorId, doctor.Email)}
              >
                <FaTrash />
              </Button>
            </td> */}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default DoctorTable;