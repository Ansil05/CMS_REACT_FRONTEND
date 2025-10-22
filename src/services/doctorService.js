import axios from 'axios';

// ✅ FIX: Use import.meta.env for Vite instead of process.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

// Get all appointments for the logged-in doctor
export const getDoctorAppointments = async () => {
  const response = await axios.get(`${API_URL}/doctor/appointments/`, getAuthHeaders());
  return response.data;
};

// Get appointment details for consultation
export const getAppointmentForConsultation = async (appointmentId) => {
  const response = await axios.get(
    `${API_URL}/doctor/appointments/${appointmentId}/get_for_consultation/`,
    getAuthHeaders()
  );
  return response.data;
};

// Get all consultations (history)
export const getConsultations = async () => {
  const response = await axios.get(`${API_URL}/doctor/consultations/`, getAuthHeaders());
  return response.data;
};

// Create a new consultation
export const createConsultation = async (consultationData) => {
  const response = await axios.post(
    `${API_URL}/doctor/consultations/`,
    consultationData,
    getAuthHeaders()
  );
  return response.data;
};

// Delete a consultation
export const deleteConsultation = async (consultationId) => {
  const response = await axios.delete(
    `${API_URL}/doctor/consultations/${consultationId}/`,
    getAuthHeaders()
  );
  return response.data;
};

const doctorService = {
  getDoctorAppointments,
  getAppointmentForConsultation,
  getConsultations,
  createConsultation,
  deleteConsultation,
};

export default doctorService;
