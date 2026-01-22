# NearbyQuest Deployment Guide

## Prerequisites

1. Node.js 18+ installed
2. Vercel CLI (`npm i -g vercel`)
3. Google Cloud account with billing enabled

## Google Cloud Setup

### 1. Create Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project named "NearbyQuest"
3. Enable billing (required for Places API)

### 2. Enable APIs
Enable these APIs in the Google Cloud Console:
- Maps JavaScript API
- Places API
- Geocoding API

### 3. Create API Keys

Create TWO separate API keys:

#### Server Key (for Vercel functions)
1. Go to APIs & Services → Credentials
2. Create API Key
3. Name it "NearbyQuest Server Key"
4. Optionally restrict by IP (Vercel deployment IPs)
5. Copy this key as `GOOGLE_MAPS_API_KEY`

#### Client Key (for frontend)
1. Create another API Key
2. Name it "NearbyQuest Client Key"
3. Restrict by HTTP referrers:
   - `localhost:*` (development)
   - `your-app.vercel.app/*` (production)
4. Copy this key as `VITE_GOOGLE_MAPS_CLIENT_KEY`

## Local Development

### 1. Clone and Install
```bash
cd nearby-places
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

### 3. Run Development Server
```bash
# Frontend only
npm run dev

# With Vercel functions
vercel dev
```

## Vercel Deployment

### 1. Link Project
```bash
vercel link
```

### 2. Set Environment Variables
In Vercel Dashboard or CLI:
```bash
vercel env add GOOGLE_MAPS_API_KEY
vercel env add VITE_GOOGLE_MAPS_CLIENT_KEY
```

### 3. Deploy
```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

## Environment Variables

| Variable | Location | Purpose |
|----------|----------|---------|
| `GOOGLE_MAPS_API_KEY` | Server | Places/Geocoding API calls |
| `VITE_GOOGLE_MAPS_CLIENT_KEY` | Client | Maps JavaScript API |

## Post-Deployment Checklist

- [ ] Verify API keys are set in Vercel
- [ ] Update client key HTTP referrer restrictions
- [ ] Test location permission flow
- [ ] Test mood selection → places loading
- [ ] Test map rendering
- [ ] Test on mobile devices
- [ ] Monitor API usage in Google Cloud Console

## Troubleshooting

### API Key Errors
- Check keys are set in Vercel environment variables
- Verify APIs are enabled in Google Cloud
- Check HTTP referrer restrictions

### CORS Issues
- Vercel functions handle CORS automatically
- Check `vercel.json` headers configuration

### Map Not Loading
- Verify `VITE_GOOGLE_MAPS_CLIENT_KEY` is set
- Check browser console for errors
- Verify Maps JavaScript API is enabled
