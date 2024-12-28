import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate(); // This must be inside a Router
  const [token, setToken] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('UserToken');
    if (storedToken) {
      setToken(storedToken);
    }
    setIsInitialized(true);
  }, []);

  const login = (jwtToken) => {
    if (jwtToken) {
      localStorage.setItem('UserToken', jwtToken);
      setToken(jwtToken);
      navigate('/home'); // Redirect after login
    } else {
      console.error('Invalid token for login');
    }
  };

  const logout = () => {
    localStorage.removeItem('UserToken');
    setToken(null);
    navigate('/home'); // Redirect to login
  };

  const value = {
    isInitialized,
    isLoggedIn: Boolean(token),
    login,
    logout,
    getToken: () => token,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Separate Protected Route component
export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isInitialized } = useAuth();
  
  if (!isInitialized) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return isLoggedIn ? children : <Navigate to="/" replace />;
};