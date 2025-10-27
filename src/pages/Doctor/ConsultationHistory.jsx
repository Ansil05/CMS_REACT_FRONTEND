import React, { useState, useEffect } from 'react';
import { getConsultations } from '../../services/doctorService';
import LoadingSpinner from '../../ui/LoadingSpinner';

function getAge(dob) {
  if (!dob) return '';
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

const ConsultationHistory = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchPatient, setSearchPatient] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'

  useEffect(() => {
    const fetchConsultations = async () => {
      setLoading(true);
      try {
        const data = await getConsultations();
        setConsultations(data);
      } catch (err) {
        // handle error gracefully
      } finally {
        setLoading(false);
      }
    };
    fetchConsultations();
  }, []);

  // Filter and sort consultations
  const filteredAndSortedConsultations = consultations
    .filter((consult) => {
      const patientName = consult.appointment?.patient
        ? `${consult.appointment.patient.first_name} ${consult.appointment.patient.last_name}`.toLowerCase()
        : '';
      const appointmentDate = consult.appointment?.appointment_date || '';

      const matchesPatient = patientName.includes(searchPatient.toLowerCase());
      const matchesDate = searchDate ? appointmentDate === searchDate : true;

      return matchesPatient && matchesDate;
    })
    .sort((a, b) => {
      const dateA = new Date(a.appointment?.appointment_date || 0);
      const dateB = new Date(b.appointment?.appointment_date || 0);

      if (sortOrder === 'newest') {
        return dateB - dateA; // Newest first
      } else {
        return dateA - dateB; // Oldest first
      }
    });

  if (loading) return <LoadingSpinner fullScreen message="Loading consultation history..." />;

  return (
    <div className="container p-4">
      <h2>Consultation History</h2>

      {/* Search and Filter Controls */}
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by patient name..."
            value={searchPatient}
            onChange={(e) => setSearchPatient(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <input
            type="date"
            className="form-control"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Diagnosis</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedConsultations.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">No consultations found.</td>
            </tr>
          )}
          {filteredAndSortedConsultations.map((consult) => (
            <tr key={consult.consultation_id}>
              <td>
                {consult.appointment?.patient
                  ? `${consult.appointment.patient.first_name} ${consult.appointment.patient.last_name}`
                  : 'N/A'}
              </td>
              <td>
                {consult.appointment?.patient?.dob
                  ? getAge(consult.appointment.patient.dob)
                  : 'N/A'}
              </td>
              <td>{consult.appointment?.patient?.phone_no || 'N/A'}</td>
              <td>{consult.appointment?.appointment_date || 'N/A'}</td>
              <td>{consult.diagnosis || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConsultationHistory;
