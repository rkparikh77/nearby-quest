import { useLocation } from '../../context/LocationContext';
import { useMood } from '../../context/MoodContext';
import GridBackground from './GridBackground';
import Header from './Header';
import LocationPrompt from '../location/LocationPrompt';
import MoodSelector from '../mood/MoodSelector';
import PlacesView from '../places/PlacesView';

export default function MainLayout() {
  const { coordinates, isLoading: locationLoading, error: locationError } = useLocation();
  const { selectedMood } = useMood();

  // Determine which view to show
  const showLocationPrompt = !coordinates && !locationLoading;
  const showMoodSelector = coordinates && !selectedMood;
  const showPlacesView = coordinates && selectedMood;

  return (
    <div className="min-h-screen bg-void relative">
      <GridBackground />
      <Header />

      <main className="relative z-10">
        {/* Location Loading */}
        {locationLoading && (
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-neon-purple border-t-transparent animate-spin" />
              <p className="text-text-secondary">Getting your location...</p>
            </div>
          </div>
        )}

        {/* Location Error */}
        {locationError && !locationLoading && (
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
            <div className="glass-elevated rounded-2xl p-8 max-w-md text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-pink/20 flex items-center justify-center">
                <span className="text-3xl">📍</span>
              </div>
              <h2 className="text-xl font-bold mb-2 text-neon-pink">Location Error</h2>
              <p className="text-text-secondary mb-6">{locationError}</p>
              <LocationPrompt />
            </div>
          </div>
        )}

        {/* Location Prompt */}
        {showLocationPrompt && !locationError && <LocationPrompt />}

        {/* Mood Selector */}
        {showMoodSelector && <MoodSelector />}

        {/* Places View */}
        {showPlacesView && <PlacesView />}
      </main>
    </div>
  );
}
