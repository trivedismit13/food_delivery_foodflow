import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

export interface City {
  cityId: number;
  cityName: string;
  district: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
}

// FIX Bug 1: Use backtick template literals so variables interpolate correctly.
// FIX Bug 5: Unwrap ApiResponse wrapper — backend returns { data: City[], message, status }

export function useSearchCities(query: string) {
  return useQuery({
    queryKey: ['cities', 'search', query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      const response = await apiClient.get<{ data: City[] }>(`/cities/search?q=${encodeURIComponent(query)}`);
      return response.data?.data ?? [];
    },
    enabled: query.length >= 2,
    staleTime: 60000,
  });
}

export async function reverseGeocodeCity(lat: number, lng: number): Promise<City> {
  const response = await apiClient.get<{ data: City }>(`/location/reverse-geocode?lat=${lat}&lng=${lng}`);
  const city = response.data?.data;
  if (!city) throw new Error('No city found near your location');
  return city;
}
