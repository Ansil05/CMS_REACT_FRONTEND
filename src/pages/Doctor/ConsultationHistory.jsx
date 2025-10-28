import React, { useState, useEffect } from 'react';
import { FaSearch, FaCalendarAlt, FaSort, FaUser, FaPhone, FaStethoscope, FaClock } from 'react-icons/fa';
import { getConsultations } from '../../services/doctorService';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { formatDate } from '../../utils/validations';

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
      {/* Header Section */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 style={{ fontWeight: 600, color: '#2c3e50', marginBottom: '0.5rem' }}>
              Consultation History
            </h2>
            <p style={{ color: '#7f8c8d', marginBottom: 0, fontSize: '0.95rem' }}>
              View and manage all your past consultations
            </p>
          </div>
          <div className="badge bg-primary" style={{ fontSize: '1rem', padding: '10px 20px', borderRadius: '20px' }}>
            {filteredAndSortedConsultations.length} {filteredAndSortedConsultations.length === 1 ? 'Consultation' : 'Consultations'}
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="card mb-4" style={{ border: 'none', borderRadius: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label" style={{ color: '#2c3e50', fontWeight: 500, marginBottom: '0.5rem' }}>
                <FaSearch className="me-2" style={{ color: '#7f8c8d' }} />
                Search Patient
              </label>
              <div className="input-group">
                <span className="input-group-text" style={{ background: '#f8f9fa', borderRight: 'none' }}>
                  <FaUser style={{ color: '#7f8c8d' }} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  style={{ borderLeft: 'none', borderRadius: '8px' }}
                  placeholder="Enter patient name..."
                  value={searchPatient}
                  onChange={(e) => setSearchPatient(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <label className="form-label" style={{ color: '#2c3e50', fontWeight: 500, marginBottom: '0.5rem' }}>
                <FaCalendarAlt className="me-2" style={{ color: '#7f8c8d' }} />
                Filter by Date
              </label>
              <div className="input-group">
                <span className="input-group-text" style={{ background: '#f8f9fa', borderRight: 'none' }}>
                  <FaCalendarAlt style={{ color: '#7f8c8d' }} />
                </span>
                <input
                  type="date"
                  className="form-control"
                  style={{ borderLeft: 'none', borderRadius: '8px' }}
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <label className="form-label" style={{ color: '#2c3e50', fontWeight: 500, marginBottom: '0.5rem' }}>
                <FaSort className="me-2" style={{ color: '#7f8c8d' }} />
                Sort Order
              </label>
              <div className="input-group">
                <span className="input-group-text" style={{ background: '#f8f9fa', borderRight: 'none' }}>
                  <FaSort style={{ color: '#7f8c8d' }} />
                </span>
                <select
                  className="form-select"
                  style={{ borderLeft: 'none', borderRadius: '8px' }}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consultations List */}
      {filteredAndSortedConsultations.length === 0 ? (
        <div className="card" style={{ border: 'none', borderRadius: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div className="card-body text-center p-5">
            <FaStethoscope size={64} style={{ color: '#bdc3c7', marginBottom: '1rem' }} />
            <h5 style={{ color: '#2c3e50', fontWeight: 600, marginBottom: '0.5rem' }}>
              No Consultations Found
            </h5>
            <p style={{ color: '#7f8c8d', marginBottom: 0 }}>
              {searchPatient || searchDate 
                ? 'Try adjusting your search filters to find consultations.'
                : 'Your consultation history will appear here once consultations are completed.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {filteredAndSortedConsultations.map((consult) => {
            const patientName = consult.appointment?.patient
              ? `${consult.appointment.patient.first_name} ${consult.appointment.patient.last_name}`
              : 'N/A';
            const patientAge = consult.appointment?.patient?.dob
              ? getAge(consult.appointment.patient.dob)
              : 'N/A';
            const phoneNumber = consult.appointment?.patient?.phone_no || 'N/A';
            const appointmentDate = consult.appointment?.appointment_date || 'N/A';
            const diagnosis = consult.diagnosis || 'No diagnosis recorded';

            return (
              <div key={consult.consultation_id} className="col-md-6 col-lg-4">
                <div 
                  className="card h-100" 
                  style={{ 
                    border: 'none', 
                    borderRadius: 15, 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  <div 
                    className="card-body p-4"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '15px 15px 0 0',
                      color: 'white'
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="mb-1" style={{ fontWeight: 600, fontSize: '1.1rem' }}>
                          {patientName}
                        </h5>
                        <div className="d-flex align-items-center" style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                          <FaClock className="me-2" />
                          {appointmentDate ? formatDate(appointmentDate) : 'N/A'}
                        </div>
                      </div>
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: '50px',
                          height: '50px',
                          background: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <FaUser size={24} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2" style={{ color: '#7f8c8d' }}>
                        <FaUser className="me-2" style={{ color: '#3498db', fontSize: '0.9rem' }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Age</span>
                      </div>
                      <p style={{ color: '#2c3e50', marginLeft: '1.75rem', marginBottom: 0, fontWeight: 600 }}>
                        {patientAge} {patientAge !== 'N/A' && 'years'}
                      </p>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2" style={{ color: '#7f8c8d' }}>
                        <FaPhone className="me-2" style={{ color: '#2ecc71', fontSize: '0.9rem' }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Phone</span>
                      </div>
                      <p style={{ color: '#2c3e50', marginLeft: '1.75rem', marginBottom: 0, fontWeight: 600 }}>
                        {phoneNumber}
                      </p>
                    </div>

                    <div className="border-top pt-3">
                      <div className="d-flex align-items-center mb-2" style={{ color: '#7f8c8d' }}>
                        <FaStethoscope className="me-2" style={{ color: '#9b59b6', fontSize: '0.9rem' }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Diagnosis</span>
                      </div>
                      <p 
                        style={{ 
                          color: '#2c3e50', 
                          marginLeft: '1.75rem', 
                          marginBottom: 0,
                          fontWeight: 500,
                          lineHeight: '1.5'
                        }}
                      >
                        {diagnosis.length > 60 ? `${diagnosis.substring(0, 60)}...` : diagnosis}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConsultationHistory;
