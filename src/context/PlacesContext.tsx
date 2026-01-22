import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import type { Place, FilterState, SortOption } from '../types';
import { useLocation } from './LocationContext';
import { useMood } from './MoodContext';
import { MOOD_CONFIG } from '../utils/moodConfig';
import { calculateDistance } from '../utils/distance';

interface PlacesContextValue {
  places: Place[];
  filteredPlaces: Place[];
  isLoading: boolean;
  error: string | null;
  selectedPlaceId: string | null;
  filters: FilterState;
  setSelectedPlaceId: (id: string | null) => void;
  setSortBy: (sort: SortOption) => void;
  setMaxDistance: (distance: number) => void;
  setMinRating: (rating: number) => void;
  setOpenNow: (openNow: boolean) => void;
  refreshPlaces: () => void;
}

const PlacesContext = createContext<PlacesContextValue | null>(null);

const DEFAULT_FILTERS: FilterState = {
  sortBy: 'distance',
  maxDistance: 5000, // 5km
  minRating: 0,
  openNow: false,
};

export function PlacesProvider({ children }: { children: ReactNode }) {
  const { coordinates } = useLocation();
  const { selectedMood } = useMood();

  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Fetch places when mood or location changes
  const fetchPlaces = useCallback(async () => {
    if (!coordinates || !selectedMood) {
      setPlaces([]);
      return;
    }

    const moodConfig = MOOD_CONFIG[selectedMood];
    if (!moodConfig) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        lat: coordinates.lat.toString(),
        lng: coordinates.lng.toString(),
        type: moodConfig.types[0],
        radius: '5000',
        keyword: moodConfig.keywords[0] || '',
      });

      const response = await fetch(`/api/places/nearby?${params}`);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Calculate distance for each place
      const placesWithDistance = data.places.map((place: Place) => ({
        ...place,
        distance: calculateDistance(
          coordinates.lat,
          coordinates.lng,
          place.geometry.location.lat,
          place.geometry.location.lng
        ),
      }));

      setPlaces(placesWithDistance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch places');
      setPlaces([]);
    } finally {
      setIsLoading(false);
    }
  }, [coordinates, selectedMood]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  // Filter and sort places
  const filteredPlaces = places
    .filter((place) => {
      if (filters.openNow && !place.openingHours?.openNow) return false;
      if (place.distance && place.distance > filters.maxDistance) return false;
      if (place.rating < filters.minRating) return false;
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.userRatingsTotal - a.userRatingsTotal;
        default:
          return 0;
      }
    });

  const setSortBy = (sortBy: SortOption) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  const setMaxDistance = (maxDistance: number) => {
    setFilters((prev) => ({ ...prev, maxDistance }));
  };

  const setMinRating = (minRating: number) => {
    setFilters((prev) => ({ ...prev, minRating }));
  };

  const setOpenNow = (openNow: boolean) => {
    setFilters((prev) => ({ ...prev, openNow }));
  };

  const value: PlacesContextValue = {
    places,
    filteredPlaces,
    isLoading,
    error,
    selectedPlaceId,
    filters,
    setSelectedPlaceId,
    setSortBy,
    setMaxDistance,
    setMinRating,
    setOpenNow,
    refreshPlaces: fetchPlaces,
  };

  return (
    <PlacesContext.Provider value={value}>{children}</PlacesContext.Provider>
  );
}

export function usePlaces() {
  const context = useContext(PlacesContext);
  if (!context) {
    throw new Error('usePlaces must be used within a PlacesProvider');
  }
  return context;
}
