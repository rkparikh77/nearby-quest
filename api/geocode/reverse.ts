import type { VercelRequest, VercelResponse } from '@vercel/node';

interface GeocodeResult {
  formatted_address: string;
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}

interface GoogleGeocodeResponse {
  results: GeocodeResult[];
  status: string;
  error_message?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Missing required parameters: lat, lng' });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('GOOGLE_MAPS_API_KEY not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const params = new URLSearchParams({
      latlng: `${lat},${lng}`,
      key: apiKey,
    });

    const url = `https://maps.googleapis.com/maps/api/geocode/json?${params}`;
    const response = await fetch(url);
    const data = (await response.json()) as GoogleGeocodeResponse;

    if (data.status !== 'OK') {
      console.error('Google Geocoding API error:', data.status, data.error_message);
      return res.status(500).json({
        error: data.error_message || 'Failed to reverse geocode',
        status: data.status,
      });
    }

    // Get the most specific address
    const result = data.results[0];
    let address = result?.formatted_address || '';

    // Try to get a shorter address (neighborhood + city)
    if (result?.address_components) {
      const neighborhood = result.address_components.find((c) =>
        c.types.includes('neighborhood')
      );
      const locality = result.address_components.find((c) =>
        c.types.includes('locality')
      );
      const sublocality = result.address_components.find((c) =>
        c.types.includes('sublocality')
      );

      const parts = [];
      if (neighborhood) parts.push(neighborhood.long_name);
      else if (sublocality) parts.push(sublocality.long_name);
      if (locality) parts.push(locality.long_name);

      if (parts.length > 0) {
        address = parts.join(', ');
      }
    }

    // Set cache headers
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');

    return res.status(200).json({
      address,
      status: 'OK',
    });
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
