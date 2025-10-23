import { API_BASE } from '../config/apiConfig';

// Existing function
export async function fetchInventory() {
  const res = await fetch(`${API_BASE}/pharmacy/inventory`);
  return res.json();
}

// Add these new functions:

// Get JWT token helper
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Get Inventory Report (Dashboard Stats)
export async function getInventoryReport() {
  const res = await fetch(`${API_BASE}/pharmacy/medicines/inventory_report/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch inventory report');
  return res.json();
}

// Get All Medicines
export async function getMedicines() {
  const res = await fetch(`${API_BASE}/pharmacy/medicines/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch medicines');
  return res.json();
}

// Get Low Stock Medicines
export async function getLowStockMedicines(threshold = 10) {
  const res = await fetch(`${API_BASE}/pharmacy/medicines/low_stock/?threshold=${threshold}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch low stock medicines');
  return res.json();
}

// Get Expiring Soon Medicines
export async function getExpiringSoonMedicines(days = 30) {
  const res = await fetch(`${API_BASE}/pharmacy/medicines/expiring_soon/?days=${days}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch expiring medicines');
  return res.json();
}

// Get All Bills
export async function getBills() {
  const res = await fetch(`${API_BASE}/pharmacy/bills/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch bills');
  return res.json();
}

// Get Billing Report
export async function getBillingReport() {
  const res = await fetch(`${API_BASE}/pharmacy/bills/billing_report/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch billing report');
  return res.json();
}
