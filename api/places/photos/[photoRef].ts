import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { photoRef, maxwidth } = req.query;

  if (!photoRef || typeof photoRef !== 'string') {
    return res.status(400).json({ error: 'Missing required parameter: photoRef' });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('GOOGLE_MAPS_API_KEY not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const params = new URLSearchParams({
      photoreference: photoRef,
      maxwidth: (maxwidth as string) || '400',
      key: apiKey,
    });

    const url = `https://maps.googleapis.com/maps/api/place/photo?${params}`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch photo' });
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Set cache headers for images
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800');
    res.setHeader('Content-Type', contentType);

    return res.send(Buffer.from(imageBuffer));
  } catch (error) {
    console.error('Error fetching photo:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
