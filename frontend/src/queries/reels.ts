import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '@/lib/api';
import { Reel, ReelRequest } from '@/types/reel';
import { PageResponse } from '@/types/api';

export const useRestaurantReels = (restaurantId: number, page: number = 0) => {
  return useQuery({
    queryKey: ['reels', 'restaurant', restaurantId, page],
    queryFn: async () => {
      const response = await api.get<{ data: PageResponse<Reel> }>(`/restaurants/${restaurantId}/reels?page=${page}&size=20`);
      return response.data.data;
    },
    enabled: !!restaurantId,
  });
};

export const useDiscoveryReels = (page: number = 0) => {
  return useQuery({
    queryKey: ['reels', 'discovery', page],
    queryFn: async () => {
      const response = await api.get<{ data: PageResponse<Reel> }>(`/reels?page=${page}&size=20`);
      return response.data.data;
    },
  });
};

export const useCreateReel = (restaurantId: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (request: ReelRequest) => {
      const response = await api.post<{ data: Reel }>(`/restaurants/${restaurantId}/reels`, request);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reels', 'restaurant', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['reels', 'discovery'] });
    },
  });
};
