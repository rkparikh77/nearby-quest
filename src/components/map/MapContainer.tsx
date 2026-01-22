import { useEffect, useRef, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import type { Place } from '../../types';
import { useLocation } from '../../context/LocationContext';
import { useMap } from '../../context/MapContext';
import { usePlaces } from '../../context/PlacesContext';
import { useMood } from '../../context/MoodContext';
import { getMoodColor } from '../../utils/moodConfig';

interface MapContainerProps {
  places: Place[];
}

// Dark mode map styles
const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8b5cf6' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#93817c' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#1e3a2e' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#447530' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#2d2d44' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1a1a2e' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b6b7b' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#3d3d5c' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1a1a2e' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8b5cf6' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2d2d44' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8b5cf6' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0a0a1a' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#3d3d5c' }],
  },
];

export default function MapContainer({ places }: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const { coordinates } = useLocation();
  const { map, setMap, setIsLoaded, selectedMarkerId, setSelectedMarkerId } = useMap();
  const { setSelectedPlaceId } = usePlaces();
  const { selectedMood } = useMood();

  const moodColor = selectedMood ? getMoodColor(selectedMood) : '#8b5cf6';

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !coordinates) return;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_CLIENT_KEY;
    if (!apiKey) {
      console.error('Google Maps API key not found');
      return;
    }

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'marker'],
    });

    loader
      .load()
      .then(async () => {
        const { Map } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary;

        const mapInstance = new Map(mapRef.current!, {
          center: { lat: coordinates.lat, lng: coordinates.lng },
          zoom: 14,
          styles: MAP_STYLES,
          disableDefaultUI: true,
          zoomControl: true,
          mapId: 'nearby-quest-map',
        });

        setMap(mapInstance);
        setIsLoaded(true);

        // Create info window
        infoWindowRef.current = new google.maps.InfoWindow();
      })
      .catch((err) => {
        console.error('Error loading Google Maps:', err);
      });

    return () => {
      setMap(null);
      setIsLoaded(false);
    };
  }, [coordinates, setMap, setIsLoaded]);

  // Create marker element
  const createMarkerElement = useCallback(
    (_place: Place, isSelected: boolean) => {
      const div = document.createElement('div');
      div.className = 'marker-container';
      div.innerHTML = `
        <div style="
          width: ${isSelected ? '40px' : '32px'};
          height: ${isSelected ? '40px' : '32px'};
          background: ${moodColor};
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 ${isSelected ? '20px' : '10px'} ${moodColor}80;
          transition: all 0.2s ease;
          border: 2px solid white;
        ">
          <span style="
            transform: rotate(45deg);
            font-size: ${isSelected ? '18px' : '14px'};
          ">📍</span>
        </div>
      `;
      return div;
    },
    [moodColor]
  );

  // Update markers when places change
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      marker.map = null;
    });
    markersRef.current = [];

    // Add user location marker
    if (coordinates) {
      const userMarkerElement = document.createElement('div');
      userMarkerElement.innerHTML = `
        <div style="
          width: 20px;
          height: 20px;
          background: #00d4ff;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 0 20px #00d4ff80;
        "></div>
      `;

      const userMarker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: coordinates.lat, lng: coordinates.lng },
        map,
        content: userMarkerElement,
        title: 'Your Location',
      });
      markersRef.current.push(userMarker);
    }

    // Add place markers
    places.forEach((place) => {
      const isSelected = selectedMarkerId === place.placeId;
      const markerElement = createMarkerElement(place, isSelected);

      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: place.geometry.location,
        map,
        content: markerElement,
        title: place.name,
      });

      marker.addListener('click', () => {
        setSelectedPlaceId(place.placeId);
        setSelectedMarkerId(place.placeId);

        // Show info window
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(`
            <div style="
              padding: 8px;
              color: #1a1a2e;
              font-family: 'Outfit', sans-serif;
            ">
              <strong style="font-size: 14px;">${place.name}</strong>
              <div style="font-size: 12px; color: #666; margin-top: 4px;">
                ⭐ ${place.rating} · ${place.address.split(',')[0]}
              </div>
            </div>
          `);
          infoWindowRef.current.open(map, marker);
        }
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (places.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      if (coordinates) {
        bounds.extend({ lat: coordinates.lat, lng: coordinates.lng });
      }
      places.forEach((place) => {
        bounds.extend(place.geometry.location);
      });
      map.fitBounds(bounds, 50);
    }
  }, [map, places, coordinates, selectedMarkerId, setSelectedPlaceId, setSelectedMarkerId, createMarkerElement]);

  // Update selected marker styling
  useEffect(() => {
    if (!map) return;

    markersRef.current.forEach((marker, index) => {
      // Skip user location marker (index 0)
      if (index === 0 || !places[index - 1]) return;

      const place = places[index - 1];
      const isSelected = selectedMarkerId === place.placeId;
      const newContent = createMarkerElement(place, isSelected);
      marker.content = newContent;
    });
  }, [selectedMarkerId, map, places, createMarkerElement]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />

      {/* Map loading overlay */}
      {!map && (
        <div className="absolute inset-0 flex items-center justify-center bg-deep-purple">
          <div className="text-center">
            <div
              className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-t-transparent animate-spin"
              style={{ borderColor: `${moodColor}30`, borderTopColor: moodColor }}
            />
            <p className="text-text-secondary">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
