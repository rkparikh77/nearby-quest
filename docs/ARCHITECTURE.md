# NearbyQuest Architecture

## Overview

NearbyQuest is a location-based places recommendation app built with React, TypeScript, and Vercel Serverless Functions.

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 with Adventure Theme
- **Animation:** Motion (Framer Motion)
- **Maps:** Google Maps JavaScript API
- **Backend:** Vercel Serverless Functions
- **APIs:** Google Places API, Google Geocoding API

## Directory Structure

```
nearby-places/
├── api/                      # Vercel Serverless Functions
│   ├── places/
│   │   ├── nearby.ts         # Nearby search proxy
│   │   ├── details/[placeId].ts
│   │   └── photos/[photoRef].ts
│   ├── geocode/reverse.ts
│   └── health.ts
│
├── src/
│   ├── components/
│   │   ├── common/           # Reusable UI components
│   │   ├── layout/           # Page layout components
│   │   ├── mood/             # Mood selection components
│   │   ├── location/         # Location permission UI
│   │   ├── map/              # Google Maps components
│   │   ├── places/           # Place listing components
│   │   └── filters/          # Filter controls
│   │
│   ├── context/              # React Context providers
│   │   ├── LocationContext   # User location state
│   │   ├── MoodContext       # Selected mood state
│   │   ├── PlacesContext     # Places data and filters
│   │   └── MapContext        # Map instance state
│   │
│   ├── hooks/                # Custom React hooks
│   ├── services/             # API client functions
│   ├── utils/                # Utility functions
│   ├── styles/               # Global styles
│   └── types/                # TypeScript definitions
│
└── docs/                     # Documentation
```

## Data Flow

```
User Location → Mood Selection → API Request → Places Display
     ↓              ↓                ↓              ↓
LocationContext → MoodContext → PlacesContext → Components
                                     ↓
                                 MapContext
```

## API Architecture

All Google API calls are proxied through Vercel Serverless Functions to:
1. Keep API keys secure (server-side only)
2. Add caching headers
3. Transform responses to a consistent format
4. Handle errors gracefully

### Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/api/places/nearby` | Search for nearby places |
| `/api/places/details/[placeId]` | Get detailed place info |
| `/api/places/photos/[photoRef]` | Proxy place photos |
| `/api/geocode/reverse` | Convert coordinates to address |
| `/api/health` | Health check |

## State Management

State is managed through React Context:

- **LocationContext:** User's coordinates, address, loading/error states
- **MoodContext:** Currently selected mood (work, date, quick-bite, budget)
- **PlacesContext:** Fetched places, filters, selected place
- **MapContext:** Google Maps instance, selected marker

## Theming

The app uses an "Adventure Mode" theme with:
- Dark background (#0a0a0f, #1a1a2e)
- Neon accent colors (pink, blue, purple, green, gold)
- Glass morphism effects
- Animated grid background
- Custom scrollbars

Each mood has an associated color used throughout the UI.
