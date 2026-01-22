import type { VercelRequest, VercelResponse } from '@vercel/node';

interface PlaceResult {
  place_id: string;
  name: string;
  vicinity: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  types: string[];
  photos?: Array<{
    photo_reference: string;
    width: number;
    height: number;
  }>;
  opening_hours?: {
    open_now: boolean;
  };
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface GooglePlacesResponse {
  results: PlaceResult[];
  status: string;
  error_message?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { lat, lng, type, radius, keyword } = req.query;

  // Validate required parameters
  if (!lat || !lng) {
    return res.status(400).json({ error: 'Missing required parameters: lat, lng' });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('GOOGLE_MAPS_API_KEY not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Build Google Places API URL
    const params = new URLSearchParams({
      location: `${lat},${lng}`,
      radius: (radius as string) || '5000',
      key: apiKey,
    });

    if (type) {
      params.append('type', type as string);
    }

    if (keyword) {
      params.append('keyword', keyword as string);
    }

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params}`;
    const response = await fetch(url);
    const data = (await response.json()) as GooglePlacesResponse;

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data.status, data.error_message);
      return res.status(500).json({
        error: data.error_message || 'Failed to fetch places',
        status: data.status,
      });
    }

    // Transform response to our format
    const places = data.results.map((place) => ({
      placeId: place.place_id,
      name: place.name,
      address: place.vicinity,
      rating: place.rating || 0,
      userRatingsTotal: place.user_ratings_total || 0,
      priceLevel: place.price_level,
      types: place.types,
      photos: place.photos?.map((photo) => ({
        photoReference: photo.photo_reference,
        width: photo.width,
        height: photo.height,
      })),
      openingHours: place.opening_hours
        ? { openNow: place.opening_hours.open_now }
        : undefined,
      geometry: {
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        },
      },
    }));

    // Set cache headers
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

    return res.status(200).json({
      places,
      status: 'OK',
    });
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
