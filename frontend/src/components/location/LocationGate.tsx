import { useEffect, useState } from 'react';
import { useLocationStore } from '@/store/locationStore';
import { reverseGeocodeCity } from '@/queries/cities';
import { LocationPrompt } from './LocationPrompt';
import { toast } from 'sonner';

export function LocationGate() {
  const { cityId, cityName, setLocation } = useLocationStore();
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Already has a location — nothing to do
    if (cityId !== null || cityName !== null) {
      setHasChecked(true);
      return;
    }

    // No location stored — try silent GPS first
    if (!navigator.geolocation) {
      setShowPrompt(true);
      setHasChecked(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          try {
            // Try to resolve to a known city in our DB
            const city = await reverseGeocodeCity(latitude, longitude);
            setLocation({
              cityId: city.cityId,
              cityName: city.cityName,
              lat: city.latitude,
              lng: city.longitude,
            });
            toast.success(`📍 Showing drops near ${city.cityName}`, {
              description: 'Based on your current location',
              duration: 3000,
            });
          } catch {
            // City not in DB — store raw coordinates as "My Location"
            setLocation({
              cityId: null,
              cityName: 'My Location',
              lat: latitude,
              lng: longitude,
            });
            toast.success('📍 Using your current coordinates', {
              description: 'Showing nearby drops',
              duration: 3000,
            });
          }
        } finally {
          setHasChecked(true);
        }
      },
      () => {
        // GPS denied — show the manual prompt
        setShowPrompt(true);
        setHasChecked(true);
      },
      { timeout: 5000, enableHighAccuracy: false }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!hasChecked || !showPrompt) return null;

  return (
    <LocationPrompt
      canSkip={true}
      onClose={() => setShowPrompt(false)}
    />
  );
}
