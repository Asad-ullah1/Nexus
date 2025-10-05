// src/config/api.js
import { API_BASE_URL } from '../lib/api';

// ✅ Reuse the same API_BASE_URL for consistency
const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
};

const signup = async (email, password, name) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Signup failed');
  }

  return response.json();
};

export { API_BASE_URL, login, signup };
