export type OrderStatus = 
  | 'PLACED' 
  | 'PREPARING' 
  | 'READY'
  | 'COMPLETED'
  | 'CANCELLED';

export type OrderType = 'REGULAR' | 'DROP_PREORDER';

import type { PaymentMethod, PaymentStatus, PaymentResponse } from './payment';
export type { PaymentMethod, PaymentStatus, PaymentResponse };

export interface OrderResponse {
  orderId: number;
  userId: number;
  restaurantId: number;
  restaurantName: string;
  status: OrderStatus;
  totalAmount: number;
  orderDate: string;
  items: OrderItemResponse[];
  paymentStatus: PaymentStatus;
  dropId?: number;

  pickupTime?: string;
  specialInstructions?: string;
}

export interface OrderItemResponse {
  orderItemId: number;
  itemId: number;
  itemName: string;
  quantity: number;
  priceEach: number;
  lineTotal: number;
}



export interface PlaceDropOrderRequest {
  dropId: number;
  items: {
    itemId: number;
    quantity: number;
  }[];
  pickupTime?: string;
  specialInstructions?: string;
}
