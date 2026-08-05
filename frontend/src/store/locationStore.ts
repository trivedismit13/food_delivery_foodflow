import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LocationState {
  cityId: number | null
  cityName: string | null
  lat: number | null
  lng: number | null
  // Backward compat
  city: string | null
  setLocation: (location: { cityId: number | null; cityName: string | null; lat: number | null; lng: number | null }) => void
  setCity: (city: string | null) => void
  clearLocation: () => void
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      cityId: null,
      cityName: null,
      lat: null,
      lng: null,
      city: null,
      setLocation: (location) => set({
        ...location,
        city: location.cityName,
      }),
      setCity: (city) => set({ city, cityName: city }),
      clearLocation: () => set({ cityId: null, cityName: null, lat: null, lng: null, city: null }),
    }),
    {
      name: 'foodflow-location',
    }
  )
)
