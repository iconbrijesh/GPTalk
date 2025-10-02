// src/MyContext.jsx
import { createContext, useState, useEffect } from 'react';

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || null);

  // Optional: sync token changes to localStorage
  useEffect(() => {
    if (authToken) {
      localStorage.setItem('token', authToken);
    } else {
      localStorage.removeItem('token');
    }
  }, [authToken]);

  return (
    <MyContext.Provider value={{ authToken, setAuthToken }}>
      {children}
    </MyContext.Provider>
  );
};