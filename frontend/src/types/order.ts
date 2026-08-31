export type OrderStatus = 
  | 'PLACED' 
  | 'PREPARING' 
  | 'READY'
  | 'ON_THE_WAY' 
  | 'DELIVERED' 
  | 'CANCELLED';

export type OrderType = 'REGULAR' | 'DROP_PREORDER';

export type PaymentMethod = 'CASH';

export type PaymentStatus = 'PENDING' | 'COLLECTED' | 'CANCELLED';

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

export interface PaymentResponse {
  paymentId: number;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  paymentDate: string;
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
