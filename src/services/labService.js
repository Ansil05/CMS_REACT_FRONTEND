import axios from "axios";
import { handleApiError } from "./api";

// Set the base URL
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// ✅ Fetch all lab tests
export async function fetchLabTests() {
  try {
    const response = await axios.get(`${API_BASE}/labtests/`);
    return response.data;
  } catch (err) {
    handleApiError(err, { fallbackMessage: "Failed to fetch lab tests." });
  }
}

// ✅ Fetch lab test by ID
export async function fetchLabTestById(testId) {
  try {
    const response = await axios.get(`${API_BASE}/labtests/${testId}/`);
    return response.data;
  } catch (err) {
    handleApiError(err, { fallbackMessage: "Failed to fetch lab test details." });
  }
}

// ✅ Fetch all lab bills
export async function fetchBills() {
  try {
    const response = await axios.get(`${API_BASE}/labbills/`);
    return response.data;
  } catch (err) {
    handleApiError(err, { fallbackMessage: "Failed to fetch lab bills." });
  }
}

// ✅ Create a new bill
export async function createBill(billData) {
  try {
    const response = await axios.post(`${API_BASE}/labbills/`, billData);
    return response.data;
  } catch (err) {
    handleApiError(err, { fallbackMessage: "Failed to create lab bill." });
  }
}

// ✅ Update an existing bill
export async function updateBill(billId, updatedData) {
  try {
    const response = await axios.put(`${API_BASE}/labbills/${billId}/`, updatedData);
    return response.data;
  } catch (err) {
    handleApiError(err, { fallbackMessage: "Failed to update lab bill." });
  }
}

// ✅ Delete a bill
export async function deleteBill(billId) {
  try {
    const response = await axios.delete(`${API_BASE}/labbills/${billId}/`);
    return response.data;
  } catch (err) {
    handleApiError(err, { fallbackMessage: "Failed to delete lab bill." });
  }
}

// ✅ Fetch all lab test requests
export async function fetchLabRequests() {
  try {
    const response = await axios.get(`${API_BASE}/labrequests/`);
    return response.data;
  } catch (err) {
    handleApiError(err, { fallbackMessage: "Failed to fetch lab test requests." });
  }
}

// ✅ Update lab test request
export async function updateLabRequest(requestId, updatedData) {
  try {
    const response = await axios.put(`${API_BASE}/labrequests/${requestId}/`, updatedData);
    return response.data;
  } catch (err) {
    handleApiError(err, { fallbackMessage: "Failed to update lab test request." });
  }
}

// ✅ Fetch lab test records
export async function fetchLabRecords() {
  try {
    const response = await axios.get(`${API_BASE}/labrecords/`);
    return response.data;
  } catch (err) {
    handleApiError(err, { fallbackMessage: "Failed to fetch lab test records." });
  }
}

// ✅ Create a new lab test record
export async function createLabRecord(recordData) {
  try {
    const response = await axios.post(`${API_BASE}/labrecords/`, recordData);
    return response.data;
  } catch (err) {
    handleApiError(err, { fallbackMessage: "Failed to create lab test record." });
  }
}

// ✅ Update lab test record
export async function updateLabRecord(recordId, updatedData) {
  try {
    const response = await axios.put(`${API_BASE}/labrecords/${recordId}/`, updatedData);
    return response.data;
  } catch (err) {
    handleApiError(err, { fallbackMessage: "Failed to update lab test record." });
  }
}
const labService = {
  fetchLabTests,
  fetchLabTestById,
  fetchBills,
  createBill,
  updateBill,
  deleteBill,
  fetchLabRequests,
  updateLabRequest,
  fetchLabRecords,
  createLabRecord,
  updateLabRecord
};

export default labService;