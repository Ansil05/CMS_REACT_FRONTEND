import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { fetchSpecializations, fetchUserRoles } from "../../services/adminService";
import useFormValidation from "../../hooks/useFormValidation";

const StaffFormModal = ({
  show,
  handleClose,
  formData,
  error,
  handleChange,
  handleSubmit,
  mode,
  doctorChange,
  doctorData,
  credentialsData,
  setCredentialsData,
  handleCredentialsChange,
  staffs,
}) => {
  const [roles, setRoles] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const { errors, validateField, checkUsernameExists, checkEmailExists } = useFormValidation();

  useEffect(() => {
    const fetchRolesAndSpecs = async () => {
      try {
        const [rolesResponse, specResponse] = await Promise.all([
          fetchUserRoles(),
          fetchSpecializations(),
        ]);
        setRoles(rolesResponse);
        setSpecializations(specResponse);
      } catch (error) {
        console.error("Failed to fetch roles or specializations:", error);
      }
    };
    fetchRolesAndSpecs();
  }, []);

  const handleValidation = (e) => {
    e.preventDefault();
    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (!hasErrors) handleSubmit(e);
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header
        closeButton
        className="bg-success text-white border-0"
        style={{ borderRadius: "0.5rem 0.5rem 0 0" }}
      >
        <Modal.Title className="fw-semibold">
          {mode === "edit" ? "Edit Staff" : "Add New Staff"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <Form onSubmit={handleValidation}>
          {/* First Name */}
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="FirstName"
              value={formData.FirstName}
              onChange={async (e) => {
                handleChange(e);
                await validateField(e.target.name, e.target.value, formData);
              }}
              isInvalid={!!errors.FirstName}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.FirstName}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Last Name */}
          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="LastName"
              value={formData.LastName}
              onChange={async (e) => {
                handleChange(e);
                await validateField(e.target.name, e.target.value, formData);
              }}
              isInvalid={!!errors.LastName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.LastName}
            </Form.Control.Feedback>
          </Form.Group>

          {/* DOB */}
          {mode !== "edit" && (
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="DOB"
                value={formData.DOB}
                onChange={async (e) => {
                  handleChange(e);
                  validateField(e.target.name, e.target.value, credentialsData);
                }}
                isInvalid={!!errors.DOB}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.DOB}
              </Form.Control.Feedback>
            </Form.Group>
          )}

          {/* Email */}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="Email"
              value={formData.Email || credentialsData.email || ""}
              onChange={async (e) => {
                handleChange(e);
                if (mode === "add" || mode === "reset") {
                  handleCredentialsChange(e);
                }
                const fieldErr = validateField(
                  e.target.name,
                  e.target.value,
                  credentialsData
                );
                if (!fieldErr && e.target.value) {
                  await checkEmailExists(e.target.value);
                }
              }}
              isInvalid={!!errors.email}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Phone */}
          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="number"
              name="PhoneNumber"
              value={formData.PhoneNumber}
              onChange={async (e) => {
                handleChange(e);
                validateField(e.target.name, e.target.value, formData);
              }}
              isInvalid={!!errors.PhoneNumber}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.PhoneNumber}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Gender */}
          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              name="Gender"
              value={formData.Gender}
              onChange={handleChange}
              isInvalid={!!errors.Gender}
              required
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.Gender}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Role */}
          {mode !== "edit" && (
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="Role"
                value={formData.Role || ""}
                onChange={async (e) => {
                  const selectedId = parseInt(e.target.value);
                  const selectedRole = roles.find((r) => r.RoleId === selectedId);
                  const roleName = selectedRole?.RoleName || "";

                  handleChange({ target: { name: "Role", value: selectedId } });

                  if (mode === "add" || mode === "reset") {
                    handleCredentialsChange({
                      target: { name: "role", value: roleName },
                    });
                  }

                  if (formData.DOB) {
                    await validateField("DOB", formData.DOB, {
                      ...formData,
                      role: roleName,
                      Role: roleName,
                    });
                  }
                }}
                isInvalid={!!errors.Role}
                required
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.RoleId} value={role.RoleId}>
                    {role.RoleName}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.Role}
              </Form.Control.Feedback>
            </Form.Group>
          )}

          {/* Doctor fields */}
          {credentialsData.role === "doctor" && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Specialization</Form.Label>
                <Form.Select
                  name="Specialization"
                  value={doctorData.Specialization}
                  onChange={async (e) => {
                    doctorChange(e);
                    validateField(e.target.name, e.target.value, doctorData);
                  }}
                  isInvalid={!!errors.Specialization || !!error.Specialization}
                  required
                >
                  <option value="">Select Specialization</option>
                  {specializations.map((spec) => (
                    <option key={spec.SpecializationId} value={spec.SpecializationId}>
                      {spec.SpecializationName}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.Specialization || error.Specialization}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Consultation Fee</Form.Label>
                <Form.Control
                  type="number"
                  name="ConsultationFee"
                  value={Number(doctorData.ConsultationFee)}
                  onChange={async (e) => {
                    doctorChange(e);
                    validateField(e.target.name, e.target.value, doctorData);
                  }}
                  isInvalid={!!errors.ConsultationFee || !!error.ConsultationFee}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.ConsultationFee || error.ConsultationFee}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Years of Experience</Form.Label>
                <Form.Select
                  name="YearsOfExperience"
                  value={doctorData.YearsOfExperience}
                  onChange={async (e) => {
                    doctorChange(e);
                    validateField(e.target.name, e.target.value, doctorData);
                  }}
                  isInvalid={!!errors.YearsOfExperience || !!error.YearsOfExperience}
                  required
                >
                  <option value="">Select Years of Experience</option>
                  {[1, 2, 3, 4, 5].map((yr) => (
                    <option key={yr} value={yr}>
                      {yr} {yr === 1 ? "Year" : "Years"}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.YearsOfExperience || error.YearsOfExperience}
                </Form.Control.Feedback>
              </Form.Group>
            </>
          )}

          {/* Address */}
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="Address"
              value={formData.Address}
              onChange={async (e) => {
                handleChange(e);
                validateField(e.target.name, e.target.value, formData);
              }}
              isInvalid={!!errors.Address}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.Address}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Credentials Section */}
          {mode !== "edit" && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={credentialsData.username}
                  onChange={async (e) => {
                    handleCredentialsChange(e);
                    const fieldErr = validateField(
                      e.target.name,
                      e.target.value,
                      credentialsData
                    );
                    if (!fieldErr && e.target.value) {
                      await checkUsernameExists(e.target.value);
                    }
                  }}
                  isInvalid={!!errors.username}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={credentialsData.password}
                  onChange={async (e) => {
                    handleCredentialsChange(e);
                    validateField(e.target.name, e.target.value, credentialsData);
                  }}
                  isInvalid={!!errors.password}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password2"
                  value={credentialsData.password2}
                  onChange={async (e) => {
                    handleCredentialsChange(e);
                    validateField(e.target.name, e.target.value, credentialsData);
                  }}
                  isInvalid={!!errors.password2}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password2}
                </Form.Control.Feedback>
              </Form.Group>
            </>
          )}

          <Button
            variant="success"
            type="submit"
            className="w-100 mt-2 fw-semibold shadow-sm"
          >
            {mode === "edit" ? "Update Staff" : "Add Staff"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default StaffFormModal;
