import { motion } from 'motion/react';
import type { Place } from '../../types';
import { usePlaces } from '../../context/PlacesContext';
import { useMap } from '../../context/MapContext';
import { useMood } from '../../context/MoodContext';
import { getMoodColor } from '../../utils/moodConfig';
import { formatDistance } from '../../utils/distance';
import { formatPriceLevel, getPhotoUrl } from '../../utils/formatting';
import PlaceRating from './PlaceRating';

interface PlaceCardProps {
  place: Place;
  index: number;
}

export default function PlaceCard({ place, index }: PlaceCardProps) {
  const { selectedPlaceId, setSelectedPlaceId } = usePlaces();
  const { panTo, setSelectedMarkerId } = useMap();
  const { selectedMood } = useMood();

  const moodColor = selectedMood ? getMoodColor(selectedMood) : '#8b5cf6';
  const isSelected = selectedPlaceId === place.placeId;

  const handleClick = () => {
    setSelectedPlaceId(place.placeId);
    setSelectedMarkerId(place.placeId);
    panTo(place.geometry.location.lat, place.geometry.location.lng);
  };

  const photoUrl = place.photos?.[0]?.photoReference
    ? getPhotoUrl(place.photos[0].photoReference)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={handleClick}
      className={`p-4 cursor-pointer transition-all duration-300 hover:bg-white/5 ${
        isSelected ? 'bg-white/10' : ''
      }`}
      style={{
        borderLeft: isSelected ? `3px solid ${moodColor}` : '3px solid transparent',
      }}
    >
      <div className="flex gap-4">
        {/* Photo */}
        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={place.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl bg-gradient-to-br from-surface to-surface-elevated">
              🏪
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name */}
          <h3 className="font-semibold text-white truncate mb-1">{place.name}</h3>

          {/* Rating & Price */}
          <div className="flex items-center gap-2 mb-1">
            <PlaceRating rating={place.rating} count={place.userRatingsTotal} />
            {place.priceLevel !== undefined && (
              <span className="text-text-muted text-sm">
                · {formatPriceLevel(place.priceLevel)}
              </span>
            )}
          </div>

          {/* Distance & Status */}
          <div className="flex items-center gap-2 text-sm">
            {place.distance !== undefined && (
              <span className="text-text-secondary">
                {formatDistance(place.distance)}
              </span>
            )}
            {place.openingHours && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  place.openingHours.openNow
                    ? 'bg-neon-green/20 text-neon-green'
                    : 'bg-neon-pink/20 text-neon-pink'
                }`}
              >
                {place.openingHours.openNow ? 'Open' : 'Closed'}
              </span>
            )}
          </div>

          {/* Address */}
          <p className="text-text-muted text-xs truncate mt-1">{place.address}</p>
        </div>
      </div>
    </motion.div>
  );
}
