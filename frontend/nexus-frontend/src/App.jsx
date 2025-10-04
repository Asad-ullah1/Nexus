import React from 'react';
import HealthCheck from './HealthCheck.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <h1>🚀 Nexus Frontend Working!</h1>
          <p>Backend API: {import.meta.env.VITE_API_BASE_URL || 'Not set'}</p>
          <HealthCheck />

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <div>
                  <h2>Welcome to Nexus</h2>
                  <a href="/login">Go to Login</a> | <a href="/signup">Sign Up</a>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
