import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../ui/LoadingSpinner';
import DoctorTable from './DoctorTable';
import api from '../../services/api';
import { getDoctors } from '../../services/adminService';


const DoctorContainer = () => {
    const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
    if (onReady){
        onReady(setDoctors);
    }}, [onReady]);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const res = await getDoctors();
        if (!res.status === 200) throw new Error('Failed to fetch doctors');
        setDoctors(res);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

    const handleEdit = (doctorId) => {
      // Handle edit action
    };
    const handleDelete = async (doctorId, email) => {
      // Handle delete action
    }
  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Doctor List</h4>
        {/* <Button variant="success" onClick={handleAdd}>
          <FaPlus /> Add New Staff
        </Button> */}
      </div>
      <DoctorTable
        setDoctors={setDoctors}
        doctors={doctors}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};
export default DoctorContainer;
