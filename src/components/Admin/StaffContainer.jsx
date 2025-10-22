import React, { useEffect, useState } from "react";
import api from "../../services/api";
import StaffTable from "./StaffTable";
import { Alert, Spinner } from "react-bootstrap";
import { fetchStaffs } from "../../services/adminService";

const StaffContainer = () => {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStaffs = async () => {
      try {
        const data = await fetchStaffs();
        setStaffs(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadStaffs();
  }, []);

  if (loading) return <Spinner animation="border" />;

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      <StaffTable staffs={staffs} />
    </>
  );
};

export default StaffContainer;
