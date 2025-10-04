// 🧩 Create API helper file for Nexus frontend
// Goal: Centralize all backend API calls using VITE_API_BASE_URL from .env

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const signupUser = async (name, email, password) => {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
};

// ✅ Export ready-to-use functions for Login.jsx and Signup.jsx
