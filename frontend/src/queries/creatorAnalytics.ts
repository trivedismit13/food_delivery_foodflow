import { useQuery, useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import type { 
  CreatorDashboardResponse, 
  WeeklyTrendResponse, 
  TopItemResponse, 
  RepeatCustomerResponse, 
  DropPerformanceResponse, 
  BestDayResponse, 
  InsightResponse,
  Page 
} from '@/types/api'

export function useCreatorDashboard(period = 'LAST_30_DAYS') {
  const { creatorProfile } = useAuthStore()
  const creatorId = creatorProfile?.restaurantId
  
  return useQuery({
    queryKey: ['creator-dashboard', creatorId, period],
    queryFn: async () => {
      const response = await apiClient.get<CreatorDashboardResponse>(
        `/creators/${creatorId}/analytics/dashboard?period=${period}`
      )
      return response.data
    },
    enabled: !!creatorId,
    staleTime: 300000,
  })
}

export function useCreatorWeeklyTrend(weeks = 12) {
  const { creatorProfile } = useAuthStore()
  const creatorId = creatorProfile?.restaurantId
  
  return useQuery({
    queryKey: ['creator-weekly-trend', creatorId, weeks],
    queryFn: async () => {
      const response = await apiClient.get<WeeklyTrendResponse[]>(
        `/creators/${creatorId}/analytics/weekly-trend?weeks=${weeks}`
      )
      return response.data
    },
    enabled: !!creatorId,
    staleTime: 300000,
  })
}

export function useCreatorTopItems(page = 0, size = 20) {
  const { creatorProfile } = useAuthStore()
  const creatorId = creatorProfile?.restaurantId
  
  return useQuery({
    queryKey: ['creator-top-items', creatorId, page, size],
    queryFn: async () => {
      const response = await apiClient.get<Page<TopItemResponse>>(
        `/creators/${creatorId}/analytics/top-items?page=${page}&size=${size}`
      )
      return response.data
    },
    enabled: !!creatorId,
    staleTime: 300000,
  })
}

export function useCreatorRepeatCustomers() {
  const { creatorProfile } = useAuthStore()
  const creatorId = creatorProfile?.restaurantId
  
  return useQuery({
    queryKey: ['creator-repeat-customers', creatorId],
    queryFn: async () => {
      const response = await apiClient.get<RepeatCustomerResponse>(
        `/creators/${creatorId}/analytics/repeat-customers`
      )
      return response.data
    },
    enabled: !!creatorId,
    staleTime: 300000,
  })
}

export function useDropPerformance(page = 0, size = 20) {
  const { creatorProfile } = useAuthStore()
  const creatorId = creatorProfile?.restaurantId
  
  return useQuery({
    queryKey: ['creator-drop-performance', creatorId, page, size],
    queryFn: async () => {
      const response = await apiClient.get<Page<DropPerformanceResponse>>(
        `/creators/${creatorId}/analytics/drop-performance?page=${page}&size=${size}`
      )
      return response.data
    },
    enabled: !!creatorId,
    staleTime: 300000,
  })
}

export function useBestDay() {
  const { creatorProfile } = useAuthStore()
  const creatorId = creatorProfile?.restaurantId
  
  return useQuery({
    queryKey: ['creator-best-day', creatorId],
    queryFn: async () => {
      const response = await apiClient.get<BestDayResponse>(
        `/creators/${creatorId}/analytics/best-day`
      )
      return response.data
    },
    enabled: !!creatorId,
    staleTime: 300000,
  })
}

export function useAutoInsights() {
  const { creatorProfile } = useAuthStore()
  const creatorId = creatorProfile?.restaurantId
  
  return useQuery({
    queryKey: ['creator-auto-insights', creatorId],
    queryFn: async () => {
      const response = await apiClient.get<InsightResponse[]>(
        `/creators/${creatorId}/analytics/insight/auto`
      )
      return response.data
    },
    enabled: !!creatorId,
    staleTime: 300000,
  })
}

export function useAskInsight() {
  const { creatorProfile } = useAuthStore()
  
  return useMutation({
    mutationFn: async (question: string) => {
      const response = await apiClient.post<InsightResponse>(
        `/creators/${creatorProfile?.restaurantId}/analytics/insight`,
        { question }
      )
      return response.data
    },
  })
}
