import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api'
import { handleApiError } from '@/lib/errorHandler'
import { useAuthStore } from '@/store/authStore'
import type { 
  Page, 
  FoodDropResponse, 
  PlaceDropOrderRequest, 
  OrderResponse,
  CreateDropRequest 
} from '@/types/api'

import { ConflictError, ValidationError } from '@/lib/api'

export interface DropFilters {
  cityId?: number
  lat?: number
  lng?: number
  date?: string
  type?: string
  sortBy?: string
  query?: string
  page?: number
  size?: number
}

function buildParams(filters?: DropFilters): string {
  const params = new URLSearchParams()
  if (filters?.cityId) params.append('cityId', String(filters.cityId))
  if (filters?.lat !== undefined) params.append('lat', String(filters.lat))
  if (filters?.lng !== undefined) params.append('lng', String(filters.lng))
  if (filters?.date) params.append('date', filters.date)
  if (filters?.type) params.append('type', filters.type)
  if (filters?.sortBy) params.append('sortBy', filters.sortBy)
  if (filters?.query) params.append('query', filters.query)
  if (filters?.page !== undefined) params.append('page', String(filters.page))
  if (filters?.size !== undefined) params.append('size', String(filters.size))
  return params.toString()
}

export function useActiveDropsFeed(filters?: DropFilters) {
  return useQuery({
    queryKey: ['drops', 'feed', filters],
    queryFn: async () => {
      const params = buildParams(filters)
      const response = await apiClient.get<Page<FoodDropResponse>>(
        `/drops?${params}`
      )
      return response.data
    },
    placeholderData: keepPreviousData,
    staleTime: 0,
    refetchInterval: 60000,
  })
}

export function useDropById(dropId: number | undefined) {
  return useQuery({
    queryKey: ['drop', dropId],
    queryFn: async () => {
      const response = await apiClient.get<FoodDropResponse>(`/drops/${dropId}`)
      return response.data
    },
    enabled: !!dropId,
    staleTime: 0,
    refetchInterval: 30000,
  })
}

export function useCreatorDrops(creatorId: number | undefined) {
  return useQuery({
    queryKey: ['drops', 'creator', creatorId],
    queryFn: async () => {
      const response = await apiClient.get<FoodDropResponse[]>(`/drops/creator/${creatorId}`)
      return response.data
    },
    enabled: !!creatorId,
    staleTime: 0,
    refetchInterval: 30000,
  })
}

export function useFollowedCreatorDrops() {
  const { isAuthenticated } = useAuthStore()
  return useQuery({
    queryKey: ['drops', 'followed'],
    queryFn: async () => {
      const response = await apiClient.get<FoodDropResponse[]>('/drops/following')
      return response.data
    },
    enabled: isAuthenticated,
    staleTime: 0,
  })
}

export function usePlaceDropOrder() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  
  return useMutation({
    mutationFn: async (request: PlaceDropOrderRequest) => {
        const response = await apiClient.post<OrderResponse>(
          `/drops/${request.dropId}/orders`,
          request
        )
        return response.data
    },
    
    onSuccess: (orderResponse) => {
      queryClient.invalidateQueries({ queryKey: ['drop', orderResponse.dropId] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      
      navigate(`/orders/${orderResponse.orderId}/track`)
    },
    
    onError: (error) => {
      if (error instanceof ConflictError) {
        toast.error('Sorry, this drop just sold out!', {
          description: 'Follow this creator to get notified of future drops.',
        })
        queryClient.invalidateQueries({ queryKey: ['drop'] })
        return
      }
      handleApiError(error)
    },
  })
}

export function useCreateDrop() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { creatorProfile } = useAuthStore()
  
  return useMutation({
    mutationFn: async (request: CreateDropRequest) => {
        const response = await apiClient.post<FoodDropResponse>('/drops', request)
        return response.data
    },
    onSuccess: (drop) => {
      queryClient.invalidateQueries({ 
        queryKey: ['drops', 'creator', creatorProfile?.restaurantId] 
      })
      toast.success('Drop created!', {
        description: 'Your drop is now visible to customers.',
      })
      navigate(`/dashboard/creator/drops/${drop.dropId}`)
    },
    onError: (error) => {
      if (error instanceof ValidationError) {
        toast.error('Validation Error', { description: error.message })
        return
      }
      handleApiError(error)
    },
  })
}

export function useUpdateDropStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ dropId, status }: { dropId: number, status: string }) => {
      const response = await apiClient.put<FoodDropResponse>(
        `/drops/${dropId}/status?status=${status}`
      )
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['drop', variables.dropId] })
      queryClient.invalidateQueries({ queryKey: ['dropOrders', variables.dropId] })
      toast.success(`Drop status updated to ${variables.status}`)
    },
    onError: (error: any) => {
      handleApiError(error)
    }
  })
}

export function useDropOrders(dropId: number | undefined) {
  return useQuery({
    queryKey: ['dropOrders', dropId],
    queryFn: async () => {
      const response = await apiClient.get<OrderResponse[]>(`/drops/${dropId}/orders`)
      return response.data
    },
    enabled: !!dropId,
    staleTime: 0,
    refetchInterval: 15000,
  })
}
