// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, signupUser } from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Optionally, you can fetch the user data here using the token
    }
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const data = await loginUser(email, password);
      console.log('Login response:', data);
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        setUser(data.user);
        setIsAuthenticated(true);
        return data;
      }
    } catch (error) {
      throw error;
    }
  };

  const handleSignup = async (name, email, password) => {
    try {
      const data = await signupUser(name, email, password);
      console.log('Signup response:', data);
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        setUser(data.user);
        setIsAuthenticated(true);
        return data;
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
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
