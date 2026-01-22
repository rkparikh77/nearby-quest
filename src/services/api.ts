import type { Place, PlaceDetails, NearbySearchResponse, PlaceDetailsResponse } from '../types';

const API_BASE = '/api';

export async function fetchNearbyPlaces(
  lat: number,
  lng: number,
  type: string,
  radius: number = 5000,
  keyword?: string
): Promise<Place[]> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lng: lng.toString(),
    type,
    radius: radius.toString(),
  });

  if (keyword) {
    params.append('keyword', keyword);
  }

  const response = await fetch(`${API_BASE}/places/nearby?${params}`);
  const data: NearbySearchResponse = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data.places;
}

export async function fetchPlaceDetails(placeId: string): Promise<PlaceDetails> {
  const response = await fetch(`${API_BASE}/places/details/${placeId}`);
  const data: PlaceDetailsResponse = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data.place;
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lng: lng.toString(),
  });

  const response = await fetch(`${API_BASE}/geocode/reverse?${params}`);
  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data.address;
}

export function getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
  return `${API_BASE}/places/photos/${photoReference}?maxwidth=${maxWidth}`;
}
