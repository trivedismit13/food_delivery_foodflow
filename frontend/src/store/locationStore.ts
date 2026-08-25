import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type LocationStatus = 'UNKNOWN' | 'REQUESTING' | 'READY' | 'ERROR'
export type LocationSource = 'GPS' | 'MANUAL'

export interface UserLocation {
  cityId: number | null
  cityName: string | null
  lat: number | null
  lng: number | null
  source: LocationSource | null
  status: LocationStatus
  error?: string
}

interface LocationState extends UserLocation {
  setLocation: (location: Partial<UserLocation>) => void
  setError: (error: string) => void
  setRequesting: () => void
  clearLocation: () => void
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      cityId: null,
      cityName: null,
      lat: null,
      lng: null,
      source: null,
      status: 'UNKNOWN',
      error: undefined,
      setLocation: (location) => set((state) => ({
        ...state,
        ...location,
        status: 'READY',
        error: undefined
      })),
      setError: (error) => set({ status: 'ERROR', error }),
      setRequesting: () => set({ status: 'REQUESTING', error: undefined }),
      clearLocation: () => set({ cityId: null, cityName: null, lat: null, lng: null, source: null, status: 'UNKNOWN', error: undefined }),
    }),
    {
      name: 'foodflow-location',
    }
  )
)
