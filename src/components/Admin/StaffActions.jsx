import React from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

const StaffActions = ({ onEdit, onDelete }) => {
  return (
    <ButtonGroup>
      <Button variant="outline-primary" size="sm" onClick={onEdit}>
        <FaEdit />
      </Button>
      <Button variant="outline-danger" size="sm" onClick={onDelete}>
        <FaTrash />
      </Button>
    </ButtonGroup>
  );
};

export default StaffActions;
