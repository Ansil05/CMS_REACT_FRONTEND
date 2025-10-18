import { API_BASE } from '../config/apiConfig';

export async function fetchAppointments() {
  const res = await fetch(`${API_BASE}/doctor/appointments`);
  return res.json();
}
