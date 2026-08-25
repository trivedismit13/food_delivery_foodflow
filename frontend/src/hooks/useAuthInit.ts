import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { apiClient } from '@/lib/api'

export function useAuthInit() {
  const { token, logout, setLoading, setAuth } = useAuthStore()
  
  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    
    // Verify token is still valid by calling /api/users/me
    apiClient.get('/users/me')
      .then((response) => {
        // Token valid — update user data in case anything changed
        // Preserve creatorProfile since /users/me doesn't return it
        const currentProfile = useAuthStore.getState().creatorProfile
        setAuth({
          ...response.data,
          token: token,  // keep existing token
          creatorProfile: response.data.creatorProfile || currentProfile,
        })
      })
      .catch(() => {
        // Token invalid or expired
        logout()
      })
      .finally(() => {
        setLoading(false)
      })
  }, []) // empty deps — run once on mount
}
