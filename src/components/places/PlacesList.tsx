import type { Place } from '../../types';
import PlaceCard from './PlaceCard';

interface PlacesListProps {
  places: Place[];
}

export default function PlacesList({ places }: PlacesListProps) {
  return (
    <div className="divide-y divide-white/10">
      {places.map((place, index) => (
        <PlaceCard key={place.placeId} place={place} index={index} />
      ))}
    </div>
  );
}
