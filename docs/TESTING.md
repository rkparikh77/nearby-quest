# NearbyQuest Testing Guide

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

## Test Structure

```
src/
├── components/
│   └── __tests__/
├── hooks/
│   └── __tests__/
├── utils/
│   └── __tests__/
└── context/
    └── __tests__/
```

## Manual Testing Checklist

### Location Flow
- [ ] App requests location on first visit
- [ ] Permission granted → shows mood selector
- [ ] Permission denied → shows error UI with retry
- [ ] Location unavailable → shows appropriate error

### Mood Selection
- [ ] All 4 mood cards display correctly
- [ ] Cards have hover animations
- [ ] Clicking mood triggers places fetch
- [ ] "Change Mood" button resets selection

### Places Display
- [ ] Places load after mood selection
- [ ] Loading spinner shows during fetch
- [ ] Error state shows if API fails
- [ ] Place cards show: name, rating, distance, status
- [ ] Photos load (or fallback shows)

### Filtering
- [ ] Sort by distance/rating/reviews works
- [ ] Distance filter limits results
- [ ] Rating filter limits results
- [ ] "Open Now" toggle works
- [ ] Result count updates

### Map
- [ ] Map renders with dark theme
- [ ] User location marker shows
- [ ] Place markers appear
- [ ] Clicking marker selects place
- [ ] Selected marker enlarges
- [ ] Info window shows on click

### Responsive Design
- [ ] Mobile: stacked layout (list above map)
- [ ] Tablet: appropriate sizing
- [ ] Desktop: side-by-side layout
- [ ] Filter bar scrolls on mobile

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Screen reader announces content
- [ ] Color contrast sufficient

## API Testing

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Nearby Places
```bash
curl "http://localhost:3000/api/places/nearby?lat=37.7749&lng=-122.4194&type=cafe&radius=1000"
```

### Place Details
```bash
curl "http://localhost:3000/api/places/details/ChIJN1t_tDeuEmsRUsoyG83frY4"
```

### Reverse Geocode
```bash
curl "http://localhost:3000/api/geocode/reverse?lat=37.7749&lng=-122.4194"
```

## Mocking

Use MSW (Mock Service Worker) for API mocking in tests:

```typescript
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('/api/places/nearby', () => {
    return HttpResponse.json({
      places: [/* mock places */],
      status: 'OK',
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Performance Testing

### Lighthouse Targets
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 80

### Load Time Targets
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3s
