import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../utils/api';

const ComponentsContext = createContext();

export const ComponentsProvider = ({ children }) => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComponents = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/components');
      setComponents(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch components:", err);
      setError(err.response?.data?.message || 'Failed to load components');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComponents();
  }, []);

  return (
    <ComponentsContext.Provider value={{ components, loading, error, refreshComponents: fetchComponents }}>
      {children}
    </ComponentsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useComponents = () => {
  return useContext(ComponentsContext);
};
