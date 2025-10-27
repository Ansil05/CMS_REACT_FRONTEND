import axios from 'axios';

// Get API URL from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});
const BASE_URL = API_URL;
// Request Interceptor — Add access token
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor — Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If token expired and not retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await axios.post(`${BASE_URL}token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        localStorage.setItem("access_token", newAccessToken);

        // Update header and retry request
        api.defaults.headers[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login"; // Redirect to login
      }
    }

    return Promise.reject(error);
  }
);

export default api;


export function handleApiError(err, { fallbackMessage = 'Something went wrong. Please try again.' } = {}) {
  // Axios error with response (server responded with 4xx/5xx)
  if (err && err.response) {
    const status = err.response.status;
    const data = err.response.data;
    let message = fallbackMessage;
    if (status === 401) message = 'Unauthorized. Please login again.';
    else if (status === 400) message = 'Bad request. Please check the request data.';
    else if (status === 404) message = 'Resource not found.';

    const error = new Error(message);
    error.status = status;
    error.data = data;
    throw error;
  }

  // Network errors or other unexpected failures
  if (err && err.message) {
    const error = new Error('Network error. Please check your connection and ensure the backend is running.');
    error.original = err;
    throw error;
  }

  // Fallback
  throw new Error('Unknown error occurred while calling the API.');
}