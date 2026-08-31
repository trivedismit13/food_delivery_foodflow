import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '@/lib/api';
import type { PaymentStatus } from '@/types/api';

export function usePaymentStatus(orderId: number) {
  return useQuery({
    queryKey: ['payment', 'status', orderId],
    queryFn: async () => {
      const { data } = await api.get<{ status: PaymentStatus }>(`/payments/${orderId}`);
      return data.status;
    },
    enabled: !!orderId,
  });
}

export function useCollectPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: number) => {
      const { data } = await api.put<{ data: any }>(`/payments/order/${orderId}/collect`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['drop-orders'] });
    }
  });
}
