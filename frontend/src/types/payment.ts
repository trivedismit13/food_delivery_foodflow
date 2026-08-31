export type PaymentMethod = 'CASH';

export type PaymentStatus = 'PENDING' | 'COLLECTED' | 'CANCELLED';

export interface PaymentResponse {
  paymentId: number;
  orderId: number;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  paymentDate: string;
}
