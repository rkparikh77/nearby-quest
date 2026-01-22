import { usePlaces } from '../../context/PlacesContext';
import { useMood } from '../../context/MoodContext';
import { getMoodColor } from '../../utils/moodConfig';
import type { SortOption } from '../../types';

export default function FilterBar() {
  const { filters, setSortBy, setMaxDistance, setMinRating, setOpenNow } = usePlaces();
  const { selectedMood } = useMood();
  const moodColor = selectedMood ? getMoodColor(selectedMood) : '#8b5cf6';

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'distance', label: 'Nearest' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'reviews', label: 'Most Popular' },
  ];

  const distanceOptions = [
    { value: 1000, label: '1 km' },
    { value: 2000, label: '2 km' },
    { value: 5000, label: '5 km' },
    { value: 10000, label: '10 km' },
  ];

  const ratingOptions = [
    { value: 0, label: 'Any' },
    { value: 3, label: '3+' },
    { value: 3.5, label: '3.5+' },
    { value: 4, label: '4+' },
    { value: 4.5, label: '4.5+' },
  ];

  return (
    <div className="p-4 border-b border-white/10 bg-surface/50">
      <div className="flex flex-wrap items-center gap-3">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-text-muted">Sort:</label>
          <select
            value={filters.sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-surface-elevated border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-neon-purple/50"
            style={{ borderColor: `${moodColor}30` }}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Distance Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-text-muted">Distance:</label>
          <select
            value={filters.maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="bg-surface-elevated border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-neon-purple/50"
            style={{ borderColor: `${moodColor}30` }}
          >
            {distanceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-text-muted">Rating:</label>
          <select
            value={filters.minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="bg-surface-elevated border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-neon-purple/50"
            style={{ borderColor: `${moodColor}30` }}
          >
            {ratingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Open Now Toggle */}
        <button
          onClick={() => setOpenNow(!filters.openNow)}
          className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
            filters.openNow
              ? 'text-white'
              : 'bg-surface-elevated border border-white/10 text-text-secondary hover:text-white'
          }`}
          style={
            filters.openNow
              ? {
                  backgroundColor: `${moodColor}30`,
                  borderColor: moodColor,
                  border: `1px solid ${moodColor}`,
                }
              : {}
          }
        >
          Open Now
        </button>
      </div>
    </div>
  );
}
