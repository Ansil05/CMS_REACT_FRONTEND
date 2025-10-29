import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import api from "../../services/api";

const SpecializationListPage = () => {
  const [specializations, setSpecializations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: "", description: "" });
  const [mode, setMode] = useState("add");

  // Fetch all specializations
  const fetchSpecializations = async () => {
    try {
      const res = await api.get("api/admin/specializations/");
      setSpecializations(res.data);
    } catch (error) {
      console.error("Error fetching specializations:", error);
    }
  };

  useEffect(() => {
    fetchSpecializations();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Add or Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "add") {
        await api.post("api/admin/specializations/", {
          SpecializationName: formData.name,
          Description: formData.description,
        });
      } else {
        await api.put(`api/admin/specializations/${formData.id}/`, {
          SpecializationName: formData.name,
          Description: formData.description,
        });
      }
      fetchSpecializations();
      handleClose();
    } catch (error) {
      console.error("Error saving specialization:", error);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this specialization?")) {
      try {
        await api.delete(`api/admin/specializations/${id}/`);
        fetchSpecializations();
      } catch (error) {
        console.error("Error deleting specialization:", error);
      }
    }
  };

  // Open modal for add/edit
  const handleShow = (modeType, specialization = null) => {
    setMode(modeType);
    if (modeType === "edit" && specialization) {
      setFormData({
        id: specialization.SpecializationId,
        name: specialization.SpecializationName,
        description: specialization.Description,
      });
    } else {
      setFormData({ id: null, name: "", description: "" });
    }
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  return (
    <div className="p-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h4 className="fw-bold text-success mb-2">Doctor Specializations</h4>
        <Button variant="success" onClick={() => handleShow("add")}>
          <FaPlus className="me-2" /> Add Specialization
        </Button>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <Table
          bordered
          hover
          responsive
          className="shadow-sm align-middle text-center"
          style={{ borderRadius: "10px", overflow: "hidden" }}
        >
          <thead style={{ backgroundColor: "#15803d", color: "white" }}>
            <tr>
              <th>ID</th>
              <th>Specialization Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {specializations.length > 0 ? (
              specializations.map((spec) => (
                <tr key={spec.SpecializationId}>
                  <td>{spec.SpecializationId}</td>
                  <td>{spec.SpecializationName}</td>
                  <td>{spec.Description}</td>
                  <td>
                    <Button
                      variant="outline-success"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShow("edit", spec)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(spec.SpecializationId)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted py-3">
                  No specializations available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {mode === "add" ? "Add New Specialization" : "Edit Specialization"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col xs={12} className="mb-3">
                <Form.Group controlId="formName">
                  <Form.Label>Specialization Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter specialization name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} className="mb-3">
                <Form.Group controlId="formDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="success" type="submit">
                {mode === "add" ? "Add" : "Update"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SpecializationListPage;
