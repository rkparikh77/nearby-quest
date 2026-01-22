# 🧭 NearbyQuest

A smart nearby places recommender that helps you discover amazing spots based on your mood. Built with React, TypeScript, and Google Maps API.

**[Live Demo](https://nearby-quest.vercel.app)**

![NearbyQuest](https://img.shields.io/badge/React-18.3-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)

## ✨ Features

- **Mood-Based Discovery** - Find places that match your vibe:
  - 💻 **Work Mode** - Quiet cafes and libraries with wifi
  - 💕 **Date Night** - Romantic restaurants and bars
  - 🍔 **Quick Bite** - Fast, tasty options when time is short
  - 💰 **Budget Friendly** - Great food that won't break the bank

- **Interactive Map** - Custom dark-themed Google Maps with animated markers
- **Smart Filtering** - Sort by distance, rating, or popularity
- **Real-Time Status** - See which places are open now
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- **Adventure Mode UI** - Retro-futuristic design with neon effects and animations

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 18, TypeScript |
| Styling | Tailwind CSS v4, CSS Animations |
| Build Tool | Vite 6 |
| Maps | Google Maps JavaScript API |
| Backend | Vercel Serverless Functions |
| APIs | Google Places API, Geocoding API |
| Animation | Motion (Framer Motion) |
| Deployment | Vercel |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Google Cloud account with billing enabled
- Google Maps API keys

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rkparikh77/nearby-quest.git
   cd nearby-quest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your Google API keys:
   ```env
   GOOGLE_MAPS_API_KEY=your_server_key_here
   VITE_GOOGLE_MAPS_CLIENT_KEY=your_client_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:5173](http://localhost:5173)

## 🔑 Google API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create two API keys:
   - **Server Key** - For serverless functions (unrestricted or IP-restricted)
   - **Client Key** - For frontend (restrict to your domains)

## 📁 Project Structure

```
nearby-quest/
├── api/                      # Vercel Serverless Functions
│   ├── places/
│   │   ├── nearby.ts         # Nearby search endpoint
│   │   ├── details/[placeId].ts
│   │   └── photos/[photoRef].ts
│   ├── geocode/reverse.ts    # Reverse geocoding
│   └── health.ts             # Health check
│
├── src/
│   ├── components/
│   │   ├── common/           # Button, Card, Skeleton, Toast
│   │   ├── layout/           # Header, MainLayout, GridBackground
│   │   ├── mood/             # MoodSelector, MoodCard
│   │   ├── location/         # LocationPrompt
│   │   ├── map/              # MapContainer
│   │   ├── places/           # PlacesView, PlaceCard, PlaceRating
│   │   └── filters/          # FilterBar
│   │
│   ├── context/              # React Context providers
│   ├── hooks/                # Custom hooks
│   ├── services/             # API client
│   ├── utils/                # Utility functions
│   ├── styles/               # Global styles
│   └── types/                # TypeScript definitions
│
├── docs/                     # Documentation
└── public/                   # Static assets
```

## 🎨 Design System

NearbyQuest uses an **Adventure Mode** theme featuring:

- **Colors**
  - Background: `#0a0a0f` (void), `#1a1a2e` (deep purple)
  - Neon accents: Pink (`#ff1493`), Blue (`#00d4ff`), Purple (`#8b5cf6`), Green (`#00ff88`)

- **Typography**
  - Headings: Space Grotesk
  - Body: Outfit

- **Effects**
  - Glass morphism cards
  - Neon glow on hover
  - Animated grid background
  - Staggered entrance animations

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/places/nearby` | GET | Search nearby places |
| `/api/places/details/[placeId]` | GET | Get place details |
| `/api/places/photos/[photoRef]` | GET | Proxy place photos |
| `/api/geocode/reverse` | GET | Convert coordinates to address |
| `/api/health` | GET | Health check |

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com/new)
3. Add environment variables:
   - `GOOGLE_MAPS_API_KEY`
   - `VITE_GOOGLE_MAPS_CLIENT_KEY`
4. Deploy!

### Environment Variables

| Variable | Description |
|----------|-------------|
| `GOOGLE_MAPS_API_KEY` | Server-side API key for Places/Geocoding |
| `VITE_GOOGLE_MAPS_CLIENT_KEY` | Client-side API key for Maps display |

## 📝 Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
npm run test      # Run tests
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Google Maps Platform](https://developers.google.com/maps)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Vercel](https://vercel.com/)

---

Made with ❤️ by [rkparikh77](https://github.com/rkparikh77)
