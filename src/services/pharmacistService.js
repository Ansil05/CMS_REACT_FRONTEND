import { API_BASE } from '../config/apiConfig';

export async function fetchInventory() {
  const res = await fetch(`${API_BASE}/pharmacy/inventory`);
  return res.json();
}
