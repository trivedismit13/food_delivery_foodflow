import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '@/lib/api';
import type { PaymentResponse } from '@/types/order';

export function usePaymentByOrder(orderId: number) {
  return useQuery({
    queryKey: ['payment', orderId],
    queryFn: async () => {
      const { data } = await api.get<{ data: PaymentResponse }>(`/payments/${orderId}`);
      return data.data;
    },
    enabled: !!orderId,
  });
}

export function useCollectPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: number) => {
      const { data } = await api.put<{ data: PaymentResponse }>(`/payments/order/${orderId}/collect`);
      return data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payment', variables] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dropOrders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables] });
    }
  });
}
