import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface MapboxContextType {
  mapboxToken: string;
  setMapboxToken: (token: string) => void;
  isTokenValid: boolean;
}

const MapboxContext = createContext<MapboxContextType | undefined>(undefined);

export const MapboxProvider = ({ children }: { children: ReactNode }) => {
  const [mapboxToken, setMapboxTokenState] = useState<string>(() => {
    return localStorage.getItem('grainGuard_mapboxToken') || '';
  });

  const setMapboxToken = (token: string) => {
    setMapboxTokenState(token);
    localStorage.setItem('grainGuard_mapboxToken', token);
  };

  const isTokenValid = mapboxToken.startsWith('pk.');

  return (
    <MapboxContext.Provider value={{ mapboxToken, setMapboxToken, isTokenValid }}>
      {children}
    </MapboxContext.Provider>
  );
};

export const useMapbox = () => {
  const context = useContext(MapboxContext);
  if (!context) {
    throw new Error('useMapbox must be used within a MapboxProvider');
  }
  return context;
};
