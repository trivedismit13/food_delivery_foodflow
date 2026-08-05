import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { SubmitRatingRequest, RatingResponse } from '@/types/api'

export function useSubmitRating() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SubmitRatingRequest) => {
      const res = await apiClient.post<{ data: RatingResponse }>('/ratings', data)
      return res.data.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['creator', variables.restaurantId] })
      queryClient.invalidateQueries({ queryKey: ['ratings', variables.restaurantId] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
