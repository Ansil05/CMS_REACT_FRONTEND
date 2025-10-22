import axios from 'axios';

// Get API URL from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/reception';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Log what we're sending
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', {
      method: config.method.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors with detailed info
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('❌ Network Error:', error.message);
      return Promise.reject({
        message: 'Network error. Please check your connection and ensure Django server is running.',
        originalError: error
      });
    }
    
    // Log detailed error for debugging
    console.error('❌ API Error Details:', {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
      headers: error.response.headers,
      config: {
        method: error.config.method,
        url: error.config.url,
        data: error.config.data
      }
    });

    // Handle specific error codes
    if (error.response.status === 400) {
      console.error('🔴 400 Bad Request - Validation Error:', error.response.data);
    } else if (error.response.status === 404) {
      console.error('🔴 404 Not Found - Endpoint does not exist');
    } else if (error.response.status === 500) {
      console.error('🔴 500 Server Error - Django backend error');
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