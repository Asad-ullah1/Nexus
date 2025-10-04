// This file is deprecated - use ../lib/api.js instead
// Keeping for backward compatibility

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
};

const signup = async (name, email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    throw new Error('Signup failed');
  }

  return response.json();
};

export { API_BASE_URL, login, signup };
export default API_BASE_URL;
