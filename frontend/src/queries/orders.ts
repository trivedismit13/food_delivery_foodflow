import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import type { PageResponse, OrderResponse, OrderStatus, PlaceDropOrderRequest } from '@/types/api'

export function useUserOrders(page = 0) {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: ['orders', user?.userId, page],
    queryFn: async () => {
      const response = await apiClient.get<PageResponse<OrderResponse>>(
        `/orders/users/${user?.userId}/orders?page=${page}&size=20`
      )
      return response.data
    },
    enabled: !!user,
    staleTime: 0,
  })
}

export function useOrderById(orderId: number | undefined) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const response = await apiClient.get<OrderResponse>(`/orders/${orderId}`)
      return response.data
    },
    enabled: !!orderId,
    staleTime: 0,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'PLACED' || status === 'PREPARING' || status === 'READY') {
        return 15000;
      }
      return false;
    }
  })
}


export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: OrderStatus }) => {
      const { data } = await apiClient.put<OrderResponse>(`/orders/${id}/status?status=${status}`)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['order', data.orderId] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      if (data.dropId) {
        queryClient.invalidateQueries({ queryKey: ['dropOrders', data.dropId] })
      }
    },
  })
}

export function usePlaceDropOrder() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (request: PlaceDropOrderRequest) => {
      const { data } = await apiClient.post<OrderResponse>(`/drops/${request.dropId}/orders`, request)
      return data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['drop', variables.dropId] })
      queryClient.invalidateQueries({ queryKey: ['dropOrders', variables.dropId] })
      queryClient.invalidateQueries({ queryKey: ['drops'] })
    },
  })
}
