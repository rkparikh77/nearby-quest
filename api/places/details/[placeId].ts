import type { VercelRequest, VercelResponse } from '@vercel/node';

interface PlaceDetailsResult {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  website?: string;
  url?: string;
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
    weekday_text?: string[];
  };
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    relative_time_description: string;
  }>;
}

interface GooglePlaceDetailsResponse {
  result: PlaceDetailsResult;
  status: string;
  error_message?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { placeId } = req.query;

  if (!placeId || typeof placeId !== 'string') {
    return res.status(400).json({ error: 'Missing required parameter: placeId' });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('GOOGLE_MAPS_API_KEY not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const fields = [
      'place_id',
      'name',
      'formatted_address',
      'formatted_phone_number',
      'website',
      'url',
      'rating',
      'user_ratings_total',
      'price_level',
      'types',
      'photos',
      'opening_hours',
      'geometry',
      'reviews',
    ].join(',');

    const params = new URLSearchParams({
      place_id: placeId,
      fields,
      key: apiKey,
    });

    const url = `https://maps.googleapis.com/maps/api/place/details/json?${params}`;
    const response = await fetch(url);
    const data = (await response.json()) as GooglePlaceDetailsResponse;

    if (data.status !== 'OK') {
      console.error('Google Places API error:', data.status, data.error_message);
      return res.status(500).json({
        error: data.error_message || 'Failed to fetch place details',
        status: data.status,
      });
    }

    const place = data.result;

    // Transform response
    const placeDetails = {
      placeId: place.place_id,
      name: place.name,
      address: place.formatted_address,
      formattedPhoneNumber: place.formatted_phone_number,
      website: place.website,
      url: place.url,
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
        ? {
            openNow: place.opening_hours.open_now,
            weekdayText: place.opening_hours.weekday_text,
          }
        : undefined,
      geometry: {
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        },
      },
      reviews: place.reviews?.map((review) => ({
        authorName: review.author_name,
        rating: review.rating,
        text: review.text,
        relativeTimeDescription: review.relative_time_description,
      })),
    };

    // Set cache headers
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');

    return res.status(200).json({
      place: placeDetails,
      status: 'OK',
    });
  } catch (error) {
    console.error('Error fetching place details:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
