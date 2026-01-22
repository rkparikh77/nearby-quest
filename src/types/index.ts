// Location Types
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationState {
  coordinates: Coordinates | null;
  address: string | null;
  error: string | null;
  isLoading: boolean;
  permissionStatus: PermissionState | null;
}

// Mood Types
export type MoodType = 'work' | 'date' | 'quick-bite' | 'budget';

export interface MoodConfig {
  id: MoodType;
  label: string;
  description: string;
  icon: string;
  types: string[];
  keywords: string[];
  color: string;
  priceLevel?: number[];
}

export interface MoodState {
  selectedMood: MoodType | null;
  setMood: (mood: MoodType | null) => void;
}

// Place Types
export interface PlacePhoto {
  photoReference: string;
  width: number;
  height: number;
}

export interface PlaceOpeningHours {
  openNow: boolean;
  weekdayText?: string[];
}

export interface PlaceGeometry {
  location: Coordinates;
}

export interface Place {
  placeId: string;
  name: string;
  address: string;
  rating: number;
  userRatingsTotal: number;
  priceLevel?: number;
  types: string[];
  photos?: PlacePhoto[];
  openingHours?: PlaceOpeningHours;
  geometry: PlaceGeometry;
  distance?: number;
}

export interface PlaceDetails extends Place {
  formattedPhoneNumber?: string;
  website?: string;
  reviews?: PlaceReview[];
  url?: string;
}

export interface PlaceReview {
  authorName: string;
  rating: number;
  text: string;
  relativeTimeDescription: string;
}

// Filter Types
export type SortOption = 'distance' | 'rating' | 'reviews';

export interface FilterState {
  sortBy: SortOption;
  maxDistance: number;
  minRating: number;
  openNow: boolean;
}

// Places Context Types
export interface PlacesState {
  places: Place[];
  isLoading: boolean;
  error: string | null;
  selectedPlaceId: string | null;
  filters: FilterState;
}

// Map Types
export interface MapState {
  map: google.maps.Map | null;
  isLoaded: boolean;
  selectedMarkerId: string | null;
}

// API Response Types
export interface NearbySearchResponse {
  places: Place[];
  status: string;
  error?: string;
}

export interface PlaceDetailsResponse {
  place: PlaceDetails;
  status: string;
  error?: string;
}

export interface ReverseGeocodeResponse {
  address: string;
  status: string;
  error?: string;
}
