import { API_BASE } from '../config/apiConfig';

export async function fetchTestRequests() {
  const res = await fetch(`${API_BASE}/lab/requests`);
  return res.json();
}
