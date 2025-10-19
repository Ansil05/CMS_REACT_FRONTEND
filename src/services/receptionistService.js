import { API_BASE } from '../config/apiConfig';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const opts = options;
  try {
    const res = await fetch(url, opts);
    // try to parse json, but handle empty bodies
    let json = null;
    try {
      json = await res.json();
    } catch (e) {
      // ignore JSON parse errors
    }

    if (!res.ok) {
      const error = new Error(json?.message || 'Request failed');
      error.response = { data: json };
      throw error;
    }

    // normalize to { data }
    return { data: json };
  } catch (err) {
    throw err;
  }
}

function buildCrud(basePath) {
  return {
    getAll: () => request(basePath),
    getById: (id) => request(`${basePath}/${id}`),
    create: (payload) => request(basePath, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
    update: (id, payload) => request(`${basePath}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
    delete: (id) => request(`${basePath}/${id}`, { method: 'DELETE' }),
  };
}

export const receptionistService = {
  patients: buildCrud('/reception/patients'),
  appointments: buildCrud('/reception/appointments'),
  bills: buildCrud('/reception/bills'),
  // doctors endpoint is optional; return empty array if API not present
  doctors: {
    getAll: async () => {
      try {
        return await request('/doctors');
      } catch (e) {
        // fallback to empty list without crashing UI
        return { data: [] };
      }
    },
  },
};

export default receptionistService;
