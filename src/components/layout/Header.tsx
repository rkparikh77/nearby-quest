import { useLocation } from '../../context/LocationContext';
import { useMood } from '../../context/MoodContext';
import { getMoodColor } from '../../utils/moodConfig';

export default function Header() {
  const { address, coordinates } = useLocation();
  const { selectedMood, setMood } = useMood();

  const moodColor = selectedMood ? getMoodColor(selectedMood) : '#8b5cf6';

  return (
    <header className="relative z-10 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{
                background: `linear-gradient(135deg, ${moodColor}40, ${moodColor}20)`,
                border: `1px solid ${moodColor}60`,
                boxShadow: `0 0 20px ${moodColor}30`,
              }}
            >
              🧭
            </div>
            <div>
              <h1
                className="text-xl font-bold font-heading"
                style={{
                  background: `linear-gradient(135deg, ${moodColor}, #fff)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                NearbyQuest
              </h1>
            </div>
          </div>

          {/* Location Display */}
          {coordinates && (
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-neon-green">📍</span>
              <span className="text-text-secondary truncate max-w-[200px]">
                {address || `${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`}
              </span>
            </div>
          )}

          {/* Reset Button */}
          {selectedMood && (
            <button
              onClick={() => setMood(null)}
              className="px-4 py-2 text-sm rounded-lg glass hover:bg-white/10 transition-colors text-text-secondary hover:text-white"
            >
              Change Mood
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
