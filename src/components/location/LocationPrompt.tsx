import { useLocation } from '../../context/LocationContext';

export default function LocationPrompt() {
  const { requestLocation, isLoading, permissionStatus } = useLocation();

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <div className="glass-elevated rounded-2xl p-8 max-w-md text-center animate-scale-in">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-neon-purple/30 to-neon-blue/30 flex items-center justify-center border border-neon-purple/50">
          <span className="text-4xl">🗺️</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold font-heading mb-3 neon-text-purple">
          Enable Location
        </h2>

        {/* Description */}
        <p className="text-text-secondary mb-6">
          NearbyQuest needs your location to discover amazing places around you.
          Your location is only used to find nearby places and is never stored.
        </p>

        {/* Permission Status */}
        {permissionStatus === 'denied' && (
          <div className="mb-6 p-4 rounded-xl bg-neon-pink/10 border border-neon-pink/30">
            <p className="text-sm text-neon-pink">
              Location access was denied. Please enable it in your browser settings.
            </p>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={requestLocation}
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #00d4ff)',
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)',
          }}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Getting Location...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>📍</span>
              Share My Location
            </span>
          )}
        </button>

        {/* Privacy Note */}
        <p className="mt-4 text-xs text-text-muted">
          Your location data stays on your device and is never shared with third parties.
        </p>
      </div>
    </div>
  );
}
