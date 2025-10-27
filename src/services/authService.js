import api, { handleApiError } from './api';
/**
 * Fetch authentication roles from the backend.
 * Uses the shared `api` axios instance and returns the roles array (or object)
 * on success. On error it throws an Error with extra properties:
 *  - message: human-friendly message
 *  - status: HTTP status (if available)
 *  - data: original error response data (if available)
 *
 * Example:
 *   try {
 *     const roles = await fetchAuthRoles();
 *     // use roles
 *   } catch (err) {
 *     console.error(err.message, err.status, err.data);
 *   }
 */


export async function fetchAuthRoles() {
  try {
    const response = await api.get('auth/roles/');
    // Response shape may vary; most backends put the payload on response.data
    // and the roles could be in response.data.role or directly in response.data
    const roles = response.data && (response.data.role ?? response.data);
    return roles;
  } catch (err) {
    handleApiError(err, { fallbackMessage: 'Failed to fetch roles.' });
  }
}

export async function deleteUserByEmail(email) {
  try {
    const response = await api.delete(`auth/delete-user/`, { data: { email } });
    return response.data;
  } catch (err) {
    handleApiError(err, { fallbackMessage: 'Failed to delete user.' });
  }
}
