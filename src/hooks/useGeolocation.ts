import { useState, useEffect, useCallback } from 'react';
import { getCurrentLocation, watchLocation, clearLocationWatch } from '@/lib/geolocation';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  isLoading: boolean;
}

interface UseGeolocationOptions {
  enableWatch?: boolean;
  onLocationChange?: (lat: number, lng: number) => void;
}

export const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const { enableWatch = false, onLocationChange } = options;

  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    isLoading: false,
  });

  const [watchId, setWatchId] = useState<number | undefined>(undefined);

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    const { latitude, longitude, accuracy } = position.coords;
    setState({
      latitude,
      longitude,
      accuracy,
      error: null,
      isLoading: false,
    });
    onLocationChange?.(latitude, longitude);
  }, [onLocationChange]);

  const handleError = useCallback((error: GeolocationPositionError) => {
    let errorMessage = 'An unknown error occurred';
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location permission denied. Please enable location access.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information is unavailable.';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out.';
        break;
    }
    setState((prev) => ({
      ...prev,
      error: errorMessage,
      isLoading: false,
    }));
  }, []);

  const getLocation = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const position = await getCurrentLocation();
      handleSuccess(position);
    } catch (error) {
      handleError(error as GeolocationPositionError);
    }
  }, [handleSuccess, handleError]);

  const startWatching = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    const id = watchLocation(handleSuccess, handleError);
    setWatchId(id);
  }, [handleSuccess, handleError]);

  const stopWatching = useCallback(() => {
    if (watchId !== undefined) {
      clearLocationWatch(watchId);
      setWatchId(undefined);
    }
  }, [watchId]);

  useEffect(() => {
    if (enableWatch) {
      startWatching();
    }
    return () => {
      if (watchId !== undefined) {
        clearLocationWatch(watchId);
      }
    };
  }, [enableWatch]);

  return {
    ...state,
    getLocation,
    startWatching,
    stopWatching,
    isWatching: watchId !== undefined,
  };
};
