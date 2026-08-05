import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api'
import { handleApiError } from '@/lib/errorHandler'
import type { Page, CreatorResponse } from '@/types/api'

export interface CreatorFilters {
  city?: string
  creatorType?: string
  page?: number
  size?: number
}

export function useCreators(filters?: CreatorFilters) {
  return useQuery({
    queryKey: ['creators', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters?.city) params.append('city', filters.city)
      if (filters?.creatorType) params.append('creatorType', filters.creatorType)
      if (filters?.page !== undefined) params.append('page', String(filters.page))
      if (filters?.size !== undefined) params.append('size', String(filters.size))
      
      const response = await apiClient.get<Page<CreatorResponse>>(
        `/creators?${params.toString()}`
      )
      return response.data
    },
    staleTime: 60000,
  })
}

export function useCreatorById(creatorId: number | undefined) {
  return useQuery({
    queryKey: ['creator', creatorId],
    queryFn: async () => {
      const response = await apiClient.get<CreatorResponse>(`/creators/${creatorId}`)
      return response.data
    },
    enabled: !!creatorId,
    staleTime: 30000,
  })
}

export function useFollowCreator() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (creatorId: number) => {
      const response = await apiClient.post(`/creators/${creatorId}/follow`)
      return response.data
    },
    onSuccess: (_, creatorId) => {
      queryClient.invalidateQueries({ queryKey: ['follow-status', creatorId] })
      queryClient.invalidateQueries({ queryKey: ['creator', creatorId] })
      toast.success('Now following! You\'ll be notified of new drops.')
    },
    onError: (error) => handleApiError(error),
  })
}

export function useUnfollowCreator() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (creatorId: number) => {
      const response = await apiClient.delete(`/creators/${creatorId}/follow`)
      return response.data
    },
    onSuccess: (_, creatorId) => {
      queryClient.invalidateQueries({ queryKey: ['follow-status', creatorId] })
      queryClient.invalidateQueries({ queryKey: ['creator', creatorId] })
      toast.success('Unfollowed creator.')
    },
    onError: (error) => handleApiError(error),
  })
}

export function useCreatorMenu(creatorId: number | undefined) {
  return useQuery({
    queryKey: ['creator-menu', creatorId],
    queryFn: async () => {
      const response = await apiClient.get<any[]>(`/creators/${creatorId}/menu`)
      return response.data
    },
    enabled: !!creatorId,
  })
}

export function useCreatorRatings(creatorId: number | undefined) {
  return useQuery({
    queryKey: ['creator-ratings', creatorId],
    queryFn: async () => {
      const response = await apiClient.get<Page<any>>(`/creators/${creatorId}/ratings`)
      return response.data
    },
    enabled: !!creatorId,
  })
}

export function useFollowStatus(creatorId: number | undefined) {
  return useQuery({
    queryKey: ['follow-status', creatorId],
    queryFn: async () => {
      const response = await apiClient.get<{isFollowing: boolean}>(`/creators/${creatorId}/follow-status`)
      return response.data.isFollowing
    },
    enabled: !!creatorId,
  })
}
