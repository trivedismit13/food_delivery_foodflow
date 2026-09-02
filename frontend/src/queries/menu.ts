import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'


export interface MenuItemRequest {
  name: string
  description: string
  price: number
  isVeg: boolean
  category: string
  availableQty: number
}

export function useMenu(restaurantId: number | undefined) {
  return useQuery({
    queryKey: ['creator-menu', restaurantId],
    queryFn: async () => {
      const response = await apiClient.get<any>(`/menu-items/${restaurantId}`)
      return response.data?.data || response.data || []
    },
    enabled: !!restaurantId,
  })
}

export function useCreateMenuItem(restaurantId: number | undefined) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (payload: MenuItemRequest) => {
      if (!restaurantId) throw new Error('Restaurant ID is required')
      const response = await apiClient.post<any>(`/menu-items/${restaurantId}`, payload)
      return response.data?.data || response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-menu'] })
    },
  })
}

export function useUpdateMenuItem(restaurantId: number | undefined) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ menuItemId, payload }: { menuItemId: number, payload: MenuItemRequest }) => {
      if (!restaurantId) throw new Error('Restaurant ID is required')
      const response = await apiClient.put<any>(`/menu-items/${restaurantId}/${menuItemId}`, payload)
      return response.data?.data || response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-menu'] })
    },
  })
}

export function useDeleteMenuItem(restaurantId: number | undefined) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (menuItemId: number) => {
      if (!restaurantId) throw new Error('Restaurant ID is required')
      await apiClient.delete(`/menu-items/${restaurantId}/${menuItemId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-menu'] })
    },
  })
}
