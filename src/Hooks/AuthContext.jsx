import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
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
      console.log('Token stored:', jwtToken);
    } else {
      console.error('Invalid token for login');
    }
  };

  const logout = () => {
    localStorage.removeItem('UserToken');
    setToken(null);
  };

  const getToken = () => token;

  const isLoggedIn = Boolean(token);

  const value = {
    isLoggedIn,
    login,
    logout,
    getToken,
    isInitialized,
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