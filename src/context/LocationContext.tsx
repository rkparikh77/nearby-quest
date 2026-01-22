import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import type { Coordinates, LocationState } from '../types';

interface LocationContextValue extends LocationState {
  requestLocation: () => void;
  clearError: () => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 300000, // 5 minutes
};

export function LocationProvider({ children }: { children: ReactNode }) {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionState | null>(null);

  // Check permission status on mount
  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((result) => {
          setPermissionStatus(result.state);
          result.onchange = () => setPermissionStatus(result.state);
        })
        .catch(() => {
          // Permissions API not supported
        });
    }
  }, []);

  // Fetch address from coordinates
  const fetchAddress = useCallback(async (coords: Coordinates) => {
    try {
      const response = await fetch(
        `/api/geocode/reverse?lat=${coords.lat}&lng=${coords.lng}`
      );
      const data = await response.json();
      if (data.address) {
        setAddress(data.address);
      }
    } catch {
      // Address fetch failed, not critical
    }
  }, []);

  // Handle successful geolocation
  const handleSuccess = useCallback(
    (position: GeolocationPosition) => {
      const coords: Coordinates = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setCoordinates(coords);
      setError(null);
      setIsLoading(false);
      fetchAddress(coords);
    },
    [fetchAddress]
  );

  // Handle geolocation error
  const handleError = useCallback((err: GeolocationPositionError) => {
    setIsLoading(false);
    switch (err.code) {
      case err.PERMISSION_DENIED:
        setError(
          'Location permission denied. Please enable location access in your browser settings.'
        );
        break;
      case err.POSITION_UNAVAILABLE:
        setError('Location information is unavailable. Please try again.');
        break;
      case err.TIMEOUT:
        setError('Location request timed out. Please try again.');
        break;
      default:
        setError('An unknown error occurred while getting your location.');
    }
  }, []);

  // Request location
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      GEOLOCATION_OPTIONS
    );
  }, [handleSuccess, handleError]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-request location if permission is granted
  useEffect(() => {
    if (permissionStatus === 'granted' && !coordinates && !isLoading) {
      requestLocation();
    }
  }, [permissionStatus, coordinates, isLoading, requestLocation]);

  const value: LocationContextValue = {
    coordinates,
    address,
    error,
    isLoading,
    permissionStatus,
    requestLocation,
    clearError,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
