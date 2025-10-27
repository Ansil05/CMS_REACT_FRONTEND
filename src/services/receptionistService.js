import api from './api';

export const receptionistService = {
  // Patients CRUD
  patients: {
    getAll: () => api.get('/api/reception/patients/'),
    getById: (id) => api.get(`api/reception/patients/${id}/`),
    create: (data) => api.post('api/reception/patients/', data),
    update: (id, data) => api.put(`api/reception/patients/${id}/`, data),
    delete: (id) => api.delete(`api/reception/patients/${id}/`),
  },

  // Appointments CRUD  
  appointments: {
    getAll: () => api.get('api/reception/appointments/'),
    getById: (id) => api.get(`api/reception/appointments/${id}/`),
    create: (data) => api.post('api/reception/appointments/', data),
    update: (id, data) => api.put(`api/reception/appointments/${id}/`, data),
    delete: (id) => api.delete(`api/reception/appointments/${id}/`),
  },

  // Billing CRUD
  bills: {
    getAll: () => api.get('api/reception/bills/'),
    getById: (id) => api.get(`api/reception/bills/${id}/`),
    create: (data) => api.post('api/reception/bills/', data),
    update: (id, data) => api.put(`api/reception/bills/${id}/`, data),
    delete: (id) => api.delete(`api/reception/bills/${id}/`),
  },

  // Doctors  
  doctors: {
    getAll: () => api.get('api/admin/doctors/'),
    getById: (id) => api.get(`api/admin/doctors/${id}/`),
  },
};
