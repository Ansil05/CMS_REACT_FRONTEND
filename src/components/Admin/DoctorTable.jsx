import React from "react";
import { Table } from "react-bootstrap";

const DoctorTable = ({ doctors }) => {
  return (

    <div className="p-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h4 className="fw-bold text-success mb-2">Doctor List</h4>
      </div>
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
              <td>
                {doctor.StaffDetail.FirstName} {doctor.StaffDetail.LastName}
              </td>
              <td>{doctor.SpecializationDetails?.SpecializationName || "N/A"}</td>
              <td>{doctor.YearsOfExperience || 0}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
    </div>
  );
};

export default DoctorTable;
