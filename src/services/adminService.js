import { API_BASE } from '../config/apiConfig';
import { handleApiError } from './api';

export const fetchStaffs = async () => {
  try {
    const response = await api.get("api/admin/staffs/"); // ✅ DRF endpoint
    return response.data;
  } catch (err) {
    handleApiError(err, { fallbackMessage: 'Failed to fetch staff data.' });
  }

};