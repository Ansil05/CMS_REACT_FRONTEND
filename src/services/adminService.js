import { API_BASE } from '../config/apiConfig';

export async function fetchUsers() {
  const res = await fetch(`${API_BASE}/admin/users`);
  return res.json();
}
