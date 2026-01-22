import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';

interface MapContextValue {
  map: google.maps.Map | null;
  isLoaded: boolean;
  selectedMarkerId: string | null;
  setMap: (map: google.maps.Map | null) => void;
  setIsLoaded: (loaded: boolean) => void;
  setSelectedMarkerId: (id: string | null) => void;
  panTo: (lat: number, lng: number) => void;
  fitBounds: (bounds: google.maps.LatLngBounds) => void;
}

const MapContext = createContext<MapContextValue | null>(null);

export function MapProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  const panTo = useCallback(
    (lat: number, lng: number) => {
      if (map) {
        map.panTo({ lat, lng });
      }
    },
    [map]
  );

  const fitBounds = useCallback(
    (bounds: google.maps.LatLngBounds) => {
      if (map) {
        map.fitBounds(bounds, 50);
      }
    },
    [map]
  );

  const value: MapContextValue = {
    map,
    isLoaded,
    selectedMarkerId,
    setMap,
    setIsLoaded,
    setSelectedMarkerId,
    panTo,
    fitBounds,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
}
