import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import type { Page, NotificationResponse } from '@/types/api'

export function useUnreadCount() {
  const { isAuthenticated } = useAuthStore()
  
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const response = await apiClient.get<number>('/notifications/unread-count')
      return response.data
    },
    enabled: isAuthenticated,
    refetchInterval: 30000,
    staleTime: 0,
  })
}

export function useNotifications() {
  const { isAuthenticated } = useAuthStore()
  
  return useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiClient.get<Page<NotificationResponse>>(
        `/notifications?page=${pageParam}&size=20`
      )
      return response.data
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.isLast) return undefined
      return lastPage.currentPage + 1
    },
    enabled: isAuthenticated,
    staleTime: 0,
    initialPageParam: 0,
  })
}

export function useMarkAllRead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      await apiClient.put('/notifications/read-all')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.setQueryData(['notifications', 'unread-count'], 0)
    },
  })
}

export function useMarkAsRead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (notificationId: string | number) => {
      await apiClient.put(`/notifications/${notificationId}/read`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.setQueryData(
        ['notifications', 'unread-count'],
        (old: number | undefined) => Math.max(0, (old || 0) - 1)
      )
    },
  })
}
