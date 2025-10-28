import { API_BASE } from '../config/apiConfig';

export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE.replace('/api', '')}/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken })
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    
    // Update access token
    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('token', data.access);
    
    return data.access;
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Clear tokens and redirect to login
    localStorage.clear();
    window.location.href = '/login';
    return null;
  }
};

export const getValidToken = async () => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  
  if (!token) {
    return null;
  }

  // Try to use current token
  return token;
};
