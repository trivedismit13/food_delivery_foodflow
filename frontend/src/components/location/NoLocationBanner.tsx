/**
 * NoLocationBanner — shown at the top of the discovery feed when no city is set.
 * Lets the user know they're seeing a nationwide feed and can refine by location.
 */
import { MapPin } from 'lucide-react';
import { useState } from 'react';
import { useLocationStore } from '@/store/locationStore';
import { LocationPrompt } from '@/components/location/LocationPrompt';

export function NoLocationBanner() {
  const { cityId } = useLocationStore();
  const [showPrompt, setShowPrompt] = useState(false);

  if (cityId !== null) return null;

  return (
    <>
      <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-orange-800">
          <MapPin size={16} className="text-orange-500 flex-shrink-0" />
          <span>Showing all drops nationwide — <strong>set your location</strong> to see drops near you</span>
        </div>
        <button
          onClick={() => setShowPrompt(true)}
          className="flex-shrink-0 text-xs font-semibold text-orange-600 bg-white border border-orange-300 rounded-lg px-3 py-1.5 hover:bg-orange-50 transition-colors"
        >
          Set Location
        </button>
      </div>
      {showPrompt && <LocationPrompt canSkip={true} onClose={() => setShowPrompt(false)} />}
    </>
  );
}
