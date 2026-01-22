import { useState, useCallback } from 'react';
import type { Place, MoodType, Coordinates } from '../types';
import { MOOD_CONFIG } from '../utils/moodConfig';
import { calculateDistance } from '../utils/distance';

interface UseNearbyPlacesState {
  places: Place[];
  isLoading: boolean;
  error: string | null;
}

export function useNearbyPlaces() {
  const [state, setState] = useState<UseNearbyPlacesState>({
    places: [],
    isLoading: false,
    error: null,
  });

  const fetchPlaces = useCallback(
    async (coordinates: Coordinates, mood: MoodType) => {
      const moodConfig = MOOD_CONFIG[mood];
      if (!moodConfig) {
        setState((prev) => ({ ...prev, error: 'Invalid mood selected' }));
        return;
      }

      setState({ places: [], isLoading: true, error: null });

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

        const placesWithDistance = data.places.map((place: Place) => ({
          ...place,
          distance: calculateDistance(
            coordinates.lat,
            coordinates.lng,
            place.geometry.location.lat,
            place.geometry.location.lng
          ),
        }));

        setState({
          places: placesWithDistance,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        setState({
          places: [],
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to fetch places',
        });
      }
    },
    []
  );

  const clearPlaces = useCallback(() => {
    setState({ places: [], isLoading: false, error: null });
  }, []);

  return {
    ...state,
    fetchPlaces,
    clearPlaces,
  };
}
