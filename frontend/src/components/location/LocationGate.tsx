import { useEffect, useState } from 'react';
import { useLocationStore } from '@/store/locationStore';
import { LocationPrompt } from './LocationPrompt';

export function LocationGate() {
  const { status } = useLocationStore();
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    if (status === 'UNKNOWN') {
      setShowPrompt(true);
    } else {
      setShowPrompt(false);
    }
  }, [status]);

  if (!hasMounted) return null; // Prevent hydration flash
  if (!showPrompt) return null;

  return (
    <LocationPrompt
      canSkip={true}
      onClose={() => setShowPrompt(false)}
    />
  );
}
