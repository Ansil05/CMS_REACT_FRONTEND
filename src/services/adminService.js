import { API_BASE } from '../config/apiConfig';
import { handleApiError } from './api';
import api from './api';

export const fetchStaffs = async () => {
  try {
    const response = await api.get("api/admin/staffs/"); // ✅ DRF endpoint
    return response.data;
  } catch (err) {
    handleApiError(err, { fallbackMessage: 'Failed to fetch staff data.' });
  }

};

export const addStaff = async (formData) => {
  try {
    const res = await api.post("api/admin/staffs/", formData);
    return res.data;
  } catch (err) {
    handleApiError(err, { fallbackMessage: 'Failed to add staff.' });
  }
};


export const updateStaff = async (id, formData) => {
  try {
    const res = await api.put(`api/admin/staffs/${id}/`, formData);
    return res.data;
  } catch (err) {
    handleApiError(err, { fallbackMessage: 'Failed to update staff.' });
  }
};

export const deleteStaff = async (id) => {
  try {
    const res = await api.delete(`api/admin/staffs/${id}/`);
    return res.data;
  } catch (err) {
    handleApiError(err, { fallbackMessage: 'Failed to delete staff.' });
  }
};

export const fetchSpecializations = async () => {
  try {
    const response = await api.get("api/admin/specializations/");
    return response.data;
  } catch (err) {
    handleApiError(err, { fallbackMessage: 'Failed to fetch specializations.' });
  }
};

export const getDoctors = async () => {
  try {
    const response = await api.get("api/admin/doctors/");
    return response.data;
  } catch (err) {
    handleApiError(err, { fallbackMessage: 'Failed to fetch doctors.' });
  }
};

export const addDoctorDetails = async (payload) => {
  try {
    const res = await api.post(`api/admin/doctors/`, payload);
    console.log("Doctor details added:", payload);
    return res.data;
  } catch (err) {
    handleApiError(err, { fallbackMessage: 'Failed to add doctor details.' });
  }
};


export const updateDoctorDetails = async (staffId, doctorData) => {
  try {
    const res = await api.put(`api/admin/doctors/${staffId}/`, doctorData);
    return res.data;
  } catch (err) {
    handleApiError(err, { fallbackMessage: 'Failed to update doctor details.' });
  }
};

export const addCredentials = async (credentialsData) => {
  try {
    const res = await api.post(`auth/signup/`, { ...credentialsData });
    return res.data;
  } catch (err) {
    handleApiError(err, { fallbackMessage: 'Failed to add credentials.' });
  }
};

export const fetchUserRoles = async () => {
  try {
    const response = await api.get("api/admin/roles/");
    return response.data;
  } catch (err) {
    handleApiError(err, { fallbackMessage: 'Failed to fetch user roles.' });
  }
};
