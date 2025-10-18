import { API_BASE } from '../config/apiConfig';

export async function fetchPatients() {
  const res = await fetch(`${API_BASE}/reception/patients`);
  return res.json();
}
