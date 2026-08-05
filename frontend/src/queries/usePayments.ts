import { useQuery } from '@tanstack/react-query';
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
