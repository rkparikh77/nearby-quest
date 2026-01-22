import { LocationProvider } from './context/LocationContext';
import { MoodProvider } from './context/MoodContext';
import { PlacesProvider } from './context/PlacesContext';
import { MapProvider } from './context/MapContext';
import MainLayout from './components/layout/MainLayout';

function App() {
  return (
    <LocationProvider>
      <MoodProvider>
        <PlacesProvider>
          <MapProvider>
            <MainLayout />
          </MapProvider>
        </PlacesProvider>
      </MoodProvider>
    </LocationProvider>
  );
}

export default App;
