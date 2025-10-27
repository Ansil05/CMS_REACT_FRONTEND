import api from './api';

const API_PREFIX = 'api/doctor/';
const API_CONSULTATION_PREFIX = 'api/reception/';

// Helper: attaches token to headers
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
  const response = await api.get(`${API_CONSULTATION_PREFIX}appointments/`, getAuthHeaders());
  return response.data;
};


// Fetch appointment details for a given appointment ID
export const getAppointmentForConsultation = async (appointmentId) => {
  const response = await api.get(`${API_CONSULTATION_PREFIX}appointments/${appointmentId}/`, getAuthHeaders());
  return response.data;
};


// Get all consultations (history)
export const getConsultations = async () => {
  const response = await api.get(`${API_PREFIX}consultations/`, getAuthHeaders());
  return response.data;
};

// Create a new consultation
export const createConsultation = async (consultationData) => {
  const response = await api.post(
    `${API_PREFIX}consultations/`,
    consultationData,
    getAuthHeaders()
  );
  return response.data;
};

// Delete a consultation
export const deleteConsultation = async (consultationId) => {
  const response = await api.delete(
    `${API_PREFIX}consultations/${consultationId}/`,
    getAuthHeaders()
  );
  return response.data;
};

// Get all prescriptions
export const getPrescriptions = async () => {
  const response = await api.get(`${API_PREFIX}prescriptions/`, getAuthHeaders());
  return response.data;
};

// Create a prescription
export const createPrescription = async (prescriptionData) => {
  const response = await api.post(
    `${API_PREFIX}prescriptions/`,
    prescriptionData,
    getAuthHeaders()
  );
  return response.data;
};

// Example: Get a specific consultation by ID
export const getConsultationById = async (consultationId) => {
  const response = await api.get(`${API_PREFIX}consultations/${consultationId}/`, getAuthHeaders());
  return response.data;
};
