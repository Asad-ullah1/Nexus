// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, signup } from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
      // Optionally, you can fetch the user data here using the token
    }
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const data = await login(email, password);
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        setUser(data.user);
        setIsAuthenticated(true);
        return data;
      }
    } catch (error) {
      throw error;
    }
  };

  const handleSignup = async (email, password, name) => {
    try {
      const data = await signup(email, password, name);
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        setUser(data.user);
        setIsAuthenticated(true);
        return data;
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login: handleLogin, signup: handleSignup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
