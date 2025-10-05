// src/lib/api.js
import axios from 'axios';

// ✅ Detect environment and use correct base URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === 'production'
    ? 'https://nexus-database-8wgh.onrender.com' // your deployed backend
    : 'http://localhost:3000'); // local dev backend

// ✅ Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ✅ Log current base URL
console.log('🔗 API Base URL:', API_BASE_URL);

// ✅ Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Success:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
    });
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
