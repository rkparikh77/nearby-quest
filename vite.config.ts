import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import type { Plugin } from 'vite';

// Custom plugin to handle API routes during development
function apiDevPlugin(): Plugin {
  let apiKey: string;

  return {
    name: 'api-dev-plugin',
    configResolved(config) {
      const env = loadEnv(config.mode, config.root, '');
      apiKey = env.GOOGLE_MAPS_API_KEY || '';
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const url = new URL(req.url, 'http://localhost');

        try {
          // Health check
          if (url.pathname === '/api/health') {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
            return;
          }

          // Nearby places
          if (url.pathname === '/api/places/nearby') {
            const lat = url.searchParams.get('lat');
            const lng = url.searchParams.get('lng');
            const type = url.searchParams.get('type') || 'restaurant';
            const radius = url.searchParams.get('radius') || '5000';
            const keyword = url.searchParams.get('keyword') || '';

            const params = new URLSearchParams({
              location: `${lat},${lng}`,
              radius,
              type,
              key: apiKey,
            });
            if (keyword) params.append('keyword', keyword);

            const response = await fetch(
              `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params}`
            );
            const data = await response.json();

            const places = (data.results || []).map((place: any) => ({
              placeId: place.place_id,
              name: place.name,
              address: place.vicinity,
              rating: place.rating || 0,
              userRatingsTotal: place.user_ratings_total || 0,
              priceLevel: place.price_level,
              types: place.types,
              photos: place.photos?.map((photo: any) => ({
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

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ places, status: 'OK' }));
            return;
          }

          // Reverse geocode
          if (url.pathname === '/api/geocode/reverse') {
            const lat = url.searchParams.get('lat');
            const lng = url.searchParams.get('lng');

            const params = new URLSearchParams({
              latlng: `${lat},${lng}`,
              key: apiKey,
            });

            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?${params}`
            );
            const data = await response.json();

            let address = data.results?.[0]?.formatted_address || '';

            // Try to get a shorter address
            const result = data.results?.[0];
            if (result?.address_components) {
              const neighborhood = result.address_components.find((c: any) =>
                c.types.includes('neighborhood')
              );
              const locality = result.address_components.find((c: any) =>
                c.types.includes('locality')
              );
              const sublocality = result.address_components.find((c: any) =>
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

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ address, status: 'OK' }));
            return;
          }

          // Photo proxy
          if (url.pathname.startsWith('/api/places/photos/')) {
            const photoRef = url.pathname.replace('/api/places/photos/', '');
            const maxwidth = url.searchParams.get('maxwidth') || '400';

            const params = new URLSearchParams({
              photoreference: photoRef,
              maxwidth,
              key: apiKey,
            });

            const response = await fetch(
              `https://maps.googleapis.com/maps/api/place/photo?${params}`
            );

            const buffer = await response.arrayBuffer();
            res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            res.end(Buffer.from(buffer));
            return;
          }

          // Place details
          if (url.pathname.startsWith('/api/places/details/')) {
            const placeId = url.pathname.replace('/api/places/details/', '');

            const fields = [
              'place_id', 'name', 'formatted_address', 'formatted_phone_number',
              'website', 'url', 'rating', 'user_ratings_total', 'price_level',
              'types', 'photos', 'opening_hours', 'geometry', 'reviews',
            ].join(',');

            const params = new URLSearchParams({
              place_id: placeId,
              fields,
              key: apiKey,
            });

            const response = await fetch(
              `https://maps.googleapis.com/maps/api/place/details/json?${params}`
            );
            const data = await response.json();
            const place = data.result;

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
              photos: place.photos?.map((photo: any) => ({
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
              reviews: place.reviews?.map((review: any) => ({
                authorName: review.author_name,
                rating: review.rating,
                text: review.text,
                relativeTimeDescription: review.relative_time_description,
              })),
            };

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ place: placeDetails, status: 'OK' }));
            return;
          }

          // Not found
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Not found' }));
        } catch (error) {
          console.error('API error:', error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Internal server error' }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), apiDevPlugin()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
