import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api'
import { handleApiError } from '@/lib/errorHandler'
import { useAuthStore } from '@/store/authStore'
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types/api'
import type { CreatorRegistrationRequest } from '@/types/creator'

export function useLogin(expectedRole?: 'CUSTOMER' | 'SELLER' | 'ADMIN') {
  const { setAuth } = useAuthStore()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  
  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      // apiClient interceptor already unwraps ApiResponse<AuthResponse>
      // So response.data is AuthResponse directly
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
      return response.data
    },
    
    onSuccess: (authResponse) => {
      // Intercept and prevent local login if entry context mismatched
      if (expectedRole === 'CUSTOMER' && authResponse.role === 'SELLER') {
        toast.error("This is a Creator account. Please use the Creator Sign In page.", { duration: 5000 })
        return
      }
      
      if (expectedRole === 'SELLER' && authResponse.role === 'CUSTOMER') {
        toast.error("This is a Customer account. Please use the Customer Sign In page.", { duration: 5000 })
        return
      }

      if (expectedRole === 'ADMIN' && authResponse.role !== 'ADMIN') {
        toast.error("Invalid administrator credentials.", { duration: 5000 })
        return
      }
      if (expectedRole !== 'ADMIN' && authResponse.role === 'ADMIN') {
        toast.error("Administrators must use the admin portal.", { duration: 5000 })
        return
      }

      // Store auth state (token goes to localStorage via persist middleware)
      setAuth(authResponse)
      
      // Clear any cached queries from previous session
      queryClient.clear()
      
      // Role-based redirect
      if (authResponse.role === 'SELLER') {
        navigate('/dashboard/creator')
      } else if (authResponse.role === 'ADMIN') {
        navigate('/admin/verification/pending')
      } else {
        // Check if there's a redirect URL in query params
        const params = new URLSearchParams(window.location.search)
        const redirectTo = params.get('redirect')
        navigate(redirectTo || '/')
      }
      
      toast.success(`Welcome back, ${authResponse.name.split(' ')[0]}!`)
    },
    
    onError: (error) => {
      handleApiError(error)
    },
  })
}

export function useRegister() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: async (userData: RegisterRequest) => {
      const response = await apiClient.post<AuthResponse>('/auth/register', userData)
      return response.data
    },
    onSuccess: (authResponse) => {
      setAuth(authResponse)
      navigate('/')
      toast.success(`Welcome to FoodFlow, ${authResponse.name.split(' ')[0]}!`)
    },
    onError: (error) => {
      handleApiError(error)
    }
  })
}


export function useRegisterCreator() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: async (creatorData: CreatorRegistrationRequest) => {
      const response = await apiClient.post<AuthResponse>('/auth/register-creator', creatorData)
      return response.data
    },
    onSuccess: (authResponse) => {
      setAuth(authResponse)
      toast.success("Welcome! Complete verification to start selling.")
      navigate('/dashboard/creator/verification')
    },
    onError: (error) => {
      handleApiError(error)
    }
  })
}
