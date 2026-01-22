import { useState, useCallback } from 'react';
import type { Coordinates } from '../types';

interface GeolocationState {
  coordinates: Coordinates | null;
  error: string | null;
  isLoading: boolean;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

const DEFAULT_OPTIONS: UseGeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 300000,
};

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    isLoading: false,
  });

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      coordinates: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
      error: null,
      isLoading: false,
    });
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    let errorMessage: string;
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location permission denied';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location unavailable';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out';
        break;
      default:
        errorMessage = 'Unknown error getting location';
    }
    setState({
      coordinates: null,
      error: errorMessage,
      isLoading: false,
    });
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({
        coordinates: null,
        error: 'Geolocation not supported',
        isLoading: false,
      });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, mergedOptions);
  }, [handleSuccess, handleError, mergedOptions]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    requestLocation,
    clearError,
  };
}
