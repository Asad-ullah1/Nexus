// 🧩 Create API helper file for Nexus frontend
// Goal: Centralize all backend API calls using VITE_API_BASE_URL from .env
// Force rebuild: 2025-10-04-v3

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log('🔗 API_BASE_URL:', API_BASE_URL); // Debug log
console.log('🔗 All env vars:', import.meta.env); // Debug all env vars

// Health check function
export const checkBackendHealth = async () => {
  try {
    console.log('🏥 Checking backend health...');
    const res = await fetch(`${API_BASE_URL}`);
    console.log('🏥 Backend status:', res.status);
    return res.status === 200;
  } catch (error) {
    console.error('❌ Backend health check failed:', error);
    return false;
  }
};

// Test function to verify URL
export const testAPIURL = () => {
  console.log('🧪 Testing API URL configuration:');
  console.log('🧪 VITE_API_BASE_URL from env:', import.meta.env.VITE_API_BASE_URL);
  console.log('🧪 Final API_BASE_URL:', API_BASE_URL);
  console.log('🧪 Test signup URL would be:', `${API_BASE_URL}/auth/signup`);
  return API_BASE_URL;
};

export const loginUser = async (email, password) => {
  console.log('🔐 Login attempt to:', `${API_BASE_URL}/auth/login`);

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    console.log('📡 Response status:', res.status);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log('✅ Login successful:', data);
    return data;
  } catch (error) {
    console.error('❌ Login error:', error);
    throw error;
  }
};

export const signupUser = async (name, email, password) => {
  console.log('📝 Signup attempt to:', `${API_BASE_URL}/auth/signup`);

  try {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    console.log('📡 Response status:', res.status);
    console.log('📡 Response headers:', res.headers);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log('✅ Signup successful:', data);
    return data;
  } catch (error) {
    console.error('❌ Signup error:', error);
    throw error;
  }
};

// ✅ Export ready-to-use functions for Login.jsx and Signup.jsx

// Default export for backward compatibility (axios-like instance)
const api = {
  get: (url) => fetch(`${API_BASE_URL}${url}`).then((res) => res.json()),
  post: (url, data) =>
    fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  put: (url, data) =>
    fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  delete: (url) =>
    fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
    }).then((res) => res.json()),
};

export default api;
