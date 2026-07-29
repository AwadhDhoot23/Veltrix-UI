import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const ComponentsContext = createContext();

export const ComponentsProvider = ({ children }) => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComponents = async () => {
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
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  return (
    <ComponentsContext.Provider value={{ components, loading, error, refreshComponents: fetchComponents }}>
      {children}
      {components.length === 0 && loading && (
        <div className='fixed inset-0 z-50 bg-neutral-950 flex flex-col items-center justify-center overflow-hidden'>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="relative flex items-center justify-center w-12 h-12">
              <div className="absolute inset-0 border-[3px] border-neutral-800 rounded-full"></div>
              <div className="absolute inset-0 border-[3px] border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
            <span className="text-neutral-200 text-sm font-semibold tracking-[0.25em] uppercase pl-2">
              Loading
            </span>
          </div>
        </div>
      )}
    </ComponentsContext.Provider>
  );
};

export const useComponents = () => {
  return useContext(ComponentsContext);
};
