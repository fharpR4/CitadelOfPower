import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

// Create context
const AuthContext = createContext({});

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkLoggedIn();
  }, []);

  const checkLoggedIn = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.getMe();
      setUser(response.data.data.user);
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setError(null);
      console.log('🔐 Attempting login for:', username);
      
      const response = await authAPI.login({ username, password });
      console.log('✅ Login response:', response.data);
      
      const { token, data } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      
      return { success: true };
    } catch (err) {
      console.error('❌ Login error:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/admin/login';
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Default export for backward compatibility
export default AuthContext;