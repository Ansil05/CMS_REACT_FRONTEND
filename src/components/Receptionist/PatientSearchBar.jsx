import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaUser, FaPhone, FaCalendar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { receptionistService } from '../../services/receptionistService';
import { formatDate } from '../../utils/validations';
import './PatientSearchBar.css';

const PatientSearchBar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    loadPatients();
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const filtered = patients.filter(patient => {
        const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
        const phone = patient.phone_no?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        
        return fullName.includes(search) || phone.includes(search);
      });
      setFilteredPatients(filtered);
      setShowDropdown(true);
    } else {
      setFilteredPatients([]);
      setShowDropdown(false);
    }
  }, [searchTerm, patients]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const response = await receptionistService.patients.getAll();
      setPatients(response.data || []);
    } catch (error) {
      console.error('Failed to load patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientClick = (patient) => {
    navigate(`/app/receptionist/patients/view/${patient.Patient_id}`);
    setSearchTerm('');
    setShowDropdown(false);
  };

  return (
    <div className="patient-search-container" ref={searchRef}>
      <div className="patient-search-input-wrapper">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="patient-search-input"
          placeholder="Search patients by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm && setShowDropdown(true)}
        />
        {loading && <div className="search-spinner"></div>}
      </div>

      {showDropdown && filteredPatients.length > 0 && (
        <div className="patient-search-dropdown">
          {filteredPatients.slice(0, 5).map((patient) => (
            <div
              key={patient.Patient_id}
              className="patient-search-item"
              onClick={() => handlePatientClick(patient)}
            >
              <div className="patient-search-avatar">
                <FaUser />
              </div>
              <div className="patient-search-details">
                <div className="patient-search-name">
                  {patient.first_name} {patient.last_name}
                </div>
                <div className="patient-search-meta">
                  <span>
                    <FaPhone size={10} /> {patient.phone_no}
                  </span>
                  {patient.last_visit && (
                    <span>
                      <FaCalendar size={10} /> Last visit: {formatDate(patient.last_visit)}
                    </span>
                  )}
                </div>
              </div>
              <div className="patient-search-id">
                #{patient.Patient_id}
              </div>
            </div>
          ))}
          
          {filteredPatients.length > 5 && (
            <div className="patient-search-more">
              +{filteredPatients.length - 5} more patients
            </div>
          )}
        </div>
      )}

      {showDropdown && searchTerm && filteredPatients.length === 0 && (
        <div className="patient-search-dropdown">
          <div className="patient-search-empty">
            No patients found matching "{searchTerm}"
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientSearchBar;
