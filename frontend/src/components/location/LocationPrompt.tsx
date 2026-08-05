import React, { useState, useCallback } from 'react';
import { MapPin, Crosshair, Search, Loader2, X, ChevronRight } from 'lucide-react';
import { useLocationStore } from '@/store/locationStore';
import { useSearchCities, reverseGeocodeCity } from '@/queries/cities';
import type { City } from '@/queries/cities';
import { toast } from 'sonner';

interface Props {
  onClose: () => void;
  canSkip?: boolean;
}

export function LocationPrompt({ onClose, canSkip = true }: Props) {
  const [query, setQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const { data: searchResults, isLoading: isSearching } = useSearchCities(query);
  const { setLocation } = useLocationStore();

  const handleDetectLocation = useCallback(() => {
    setIsDetecting(true);
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const city = await reverseGeocodeCity(latitude, longitude);
          // GPS found a city in our DB — use it with full geodata
          setLocation({
            cityId: city.cityId,
            cityName: city.cityName,
            lat: city.latitude,
            lng: city.longitude,
          });
          toast.success(`📍 Location set to ${city.cityName}`);
          onClose();
        } catch {
          // GPS worked but city not in DB — use raw coordinates with a generic label
          // This way we still store lat/lng for future proximity filtering
          const { latitude, longitude } = position.coords;
          setLocation({
            cityId: null,
            cityName: 'My Location',
            lat: latitude,
            lng: longitude,
          });
          toast.success('📍 Using your current coordinates');
          onClose();
        } finally {
          setIsDetecting(false);
        }
      },
      () => {
        toast.error('Location access denied. Please search for your city below.');
        setIsDetecting(false);
      },
      { timeout: 10000 }
    );
  }, [setLocation, onClose]);

  const handleSelectCity = useCallback((city: City) => {
    setLocation({
      cityId: city.cityId,
      cityName: city.cityName,
      lat: city.latitude,
      lng: city.longitude,
    });
    toast.success(`📍 Location set to ${city.cityName}`);
    onClose();
  }, [setLocation, onClose]);

  // Allow user to confirm any free-text city that's not in our DB
  const handleConfirmFreeText = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setLocation({
      cityId: null,
      cityName: trimmed,
      lat: null,
      lng: null,
    });
    toast.success(`📍 Location set to ${trimmed}`);
    onClose();
  }, [query, setLocation, onClose]);

  const hasNoResults = query.length >= 2 && !isSearching && (!searchResults || searchResults.length === 0);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={canSkip ? onClose : undefined}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white relative">
          {canSkip && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          )}
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Where are you?</h2>
              <p className="text-orange-100 text-sm">Discover drops from creators near you</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* GPS Detect Button */}
          <button
            onClick={handleDetectLocation}
            disabled={isDetecting}
            className="w-full flex items-center gap-3 py-3.5 px-4 bg-orange-50 border border-orange-200 text-orange-700 rounded-xl font-medium hover:bg-orange-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            <div className="w-8 h-8 rounded-full bg-orange-100 group-hover:bg-orange-200 transition-colors flex items-center justify-center flex-shrink-0">
              {isDetecting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Crosshair className="w-4 h-4" />
              )}
            </div>
            <span>{isDetecting ? 'Detecting your location…' : 'Use my current location'}</span>
            {!isDetecting && <ChevronRight size={16} className="ml-auto text-orange-400" />}
          </button>

          {/* Divider */}
          <div className="relative flex items-center gap-3">
            <div className="h-px bg-stone-200 flex-1" />
            <span className="text-xs font-medium text-stone-400 uppercase tracking-widest">OR</span>
            <div className="h-px bg-stone-200 flex-1" />
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 text-stone-400 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim().length >= 2) {
                  // If there are search results, pick the first one
                  if (searchResults && searchResults.length > 0) {
                    handleSelectCity(searchResults[0]);
                  } else if (hasNoResults) {
                    // Accept free-text on Enter
                    handleConfirmFreeText();
                  }
                }
              }}
              placeholder="Type your city name…"
              className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm transition-all"
            />
          </div>

          {/* Search Results Dropdown */}
          {query.length >= 2 && (
            <div className="border border-stone-100 rounded-xl overflow-hidden shadow-sm max-h-[240px] overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-stone-500 text-sm flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Searching…
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <>
                  {searchResults.map((city) => (
                    <button
                      key={city.cityId}
                      onClick={() => handleSelectCity(city)}
                      className="w-full text-left px-4 py-3 hover:bg-orange-50 border-b border-stone-50 last:border-0 flex items-center gap-3 transition-colors group"
                    >
                      <MapPin size={16} className="text-stone-400 group-hover:text-orange-500 flex-shrink-0 transition-colors" />
                      <div>
                        <span className="font-medium text-stone-800 text-sm">{city.cityName}</span>
                        <span className="text-xs text-stone-500 ml-2">{city.state}, {city.country}</span>
                      </div>
                    </button>
                  ))}
                </>
              ) : (
                /* City not in our DB — allow confirming free-text */
                <div>
                  <div className="px-4 pt-3 pb-1 text-xs text-stone-400">
                    "{query}" not in our city list — you can still use it:
                  </div>
                  <button
                    onClick={handleConfirmFreeText}
                    className="w-full text-left px-4 py-3 hover:bg-orange-50 flex items-center gap-3 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-full bg-orange-100 group-hover:bg-orange-200 flex items-center justify-center flex-shrink-0 transition-colors">
                      <MapPin size={14} className="text-orange-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-stone-800 text-sm">Use "{query}"</span>
                      <p className="text-xs text-stone-500">We'll show all available drops</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}

          {canSkip && (
            <button
              onClick={onClose}
              className="w-full text-center text-xs text-stone-400 hover:text-stone-600 transition-colors py-1"
            >
              Skip for now — show all drops
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
