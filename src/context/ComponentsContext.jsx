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
      {components.length === 0 && loading && (
        <div className="fixed inset-0 z-50 bg-neutral-950 flex flex-col items-center justify-center overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Branding — matches Footer & HomePage */}
            <h1 className="font-extrabold text-5xl tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]">
              Veltrix UI
            </h1>
            <p className="text-neutral-500 text-sm -mt-5">
              A curated library of reusable React UI components.
            </p>

            {/* Spinner */}
            <div className="relative flex items-center justify-center w-10 h-10 mt-2">
              <div className="absolute inset-0 border-[2px] border-neutral-800 rounded-full" />
              <div className="absolute inset-0 border-[2px] border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
            </div>

            {/* Loading label */}
            <span className="text-neutral-500 text-xs font-semibold tracking-[0.3em] uppercase -mt-4">
              Loading components…
            </span>
          </div>
        </div>
      )}
    </ComponentsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useComponents = () => {
  return useContext(ComponentsContext);
};
