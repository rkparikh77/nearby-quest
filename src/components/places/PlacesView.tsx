import { usePlaces } from '../../context/PlacesContext';
import { useMood } from '../../context/MoodContext';
import { getMoodColor } from '../../utils/moodConfig';
import PlacesList from './PlacesList';
import MapContainer from '../map/MapContainer';
import FilterBar from '../filters/FilterBar';
import LoadingSpinner from '../common/LoadingSpinner';

export default function PlacesView() {
  const { isLoading, error, filteredPlaces } = usePlaces();
  const { selectedMood } = useMood();
  const moodColor = selectedMood ? getMoodColor(selectedMood) : '#8b5cf6';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <LoadingSpinner color={moodColor} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="glass-elevated rounded-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-pink/20 flex items-center justify-center">
            <span className="text-3xl">😕</span>
          </div>
          <h2 className="text-xl font-bold mb-2 text-neon-pink">Oops!</h2>
          <p className="text-text-secondary">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
      {/* Left Panel - List View */}
      <div className="w-full lg:w-[400px] xl:w-[450px] flex flex-col h-full lg:h-auto lg:max-h-full border-r border-white/10">
        {/* Filter Bar */}
        <FilterBar />

        {/* Results count */}
        <div className="px-4 py-2 text-sm text-text-secondary border-b border-white/10">
          {filteredPlaces.length} places found
        </div>

        {/* Places List */}
        <div className="flex-1 overflow-y-auto">
          {filteredPlaces.length > 0 ? (
            <PlacesList places={filteredPlaces} />
          ) : (
            <div className="flex items-center justify-center h-full p-8 text-center">
              <div>
                <span className="text-4xl mb-4 block">🔍</span>
                <p className="text-text-secondary">
                  No places match your filters. Try adjusting them.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Map View */}
      <div className="flex-1 h-[300px] lg:h-full">
        <MapContainer places={filteredPlaces} />
      </div>
    </div>
  );
}
