import api from './api';

export const receptionistService = {
  // Patients CRUD
  patients: {
    getAll: () => api.get('/patients/'),
    getById: (id) => api.get(`/patients/${id}/`),
    create: (data) => api.post('/patients/', data),
    update: (id, data) => api.put(`/patients/${id}/`, data),
    delete: (id) => api.delete(`/patients/${id}/`),
  },
  
  // Appointments CRUD
  appointments: {
    getAll: () => api.get('/appointments/'),
    getById: (id) => api.get(`/appointments/${id}/`),
    create: (data) => api.post('/appointments/', data),
    update: (id, data) => api.put(`/appointments/${id}/`, data),
    delete: (id) => api.delete(`/appointments/${id}/`),
  },

  // Billing CRUD
  bills: {
    getAll: () => api.get('/bills/'),
    getById: (id) => api.get(`/bills/${id}/`),
    create: (data) => api.post('/bills/', data),
    update: (id, data) => api.put(`/bills/${id}/`, data),
    delete: (id) => api.delete(`/bills/${id}/`),
  },
};
