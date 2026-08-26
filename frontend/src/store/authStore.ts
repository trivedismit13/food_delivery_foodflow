import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthResponse, CreatorSummary, UserRole } from '@/types/api'

interface User {
  userId: number
  name: string
  email: string
  role: UserRole
}

interface AuthState {
  user: User | null
  token: string | null
  creatorProfile: CreatorSummary | null
  isAuthenticated: boolean
  isLoading: boolean
  
  setAuth: (authResponse: AuthResponse) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  
  isCreator: () => boolean
  isAdmin: () => boolean
  isCustomer: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      creatorProfile: null,
      isAuthenticated: false,
      isLoading: true, // Starts true until verified on mount

      setAuth: (authResponse) => set({
        user: {
          userId: authResponse.userId,
          name: authResponse.name,
          email: authResponse.email,
          role: authResponse.role,
        },
        token: authResponse.token,
        creatorProfile: authResponse.creatorProfile || null,
        isAuthenticated: true,
        isLoading: false,
      }),

      logout: () => {
        set({
          user: null,
          token: null,
          creatorProfile: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      isCreator: () => get().user?.role === 'SELLER',
      isAdmin: () => get().user?.role === 'ADMIN',
      isCustomer: () => get().user?.role === 'CUSTOMER',
    }),
    {
      name: 'foodflow-auth',           // localStorage key
      partialize: (state) => ({        // only persist these fields
        user: state.user,
        token: state.token,
        creatorProfile: state.creatorProfile,
        isAuthenticated: state.isAuthenticated,
      }),
      // isLoading is NOT persisted — always starts false after hydration
    }
  )
)
