import { CreatorSummary } from './creator';

export type DropStatus = 
  | 'DRAFT' 
  | 'ANNOUNCED' 
  | 'OPEN' 
  | 'CUTOFF' 
  | 'READY' 
  | 'COMPLETED' 
  | 'CANCELLED';

export interface FoodDropResponse {
  dropId: number;
  title: string;
  description: string;
  dropDate: string;        
  orderCutoffTime: string; 
  pickupLocation: string;
  pickupTime: string;
  maxOrders: number;
  currentOrders: number;
  availableSlots: number;  
  isSoldOut: boolean;      
  status: DropStatus;

  dropPhotoUrl: string | null;
  specialNotes: string | null;
  creator: CreatorSummary;
  items: DropItemResponse[];
  minutesUntilCutoff: number | null;  
}

export interface DropItemResponse {
  itemId: number;
  name: string;
  description: string;
  isVeg: boolean;
  price: number;
  dropPrice: number | null;
  quantityAvailable: number;
  quantityOrdered: number;
  isSoldOut: boolean;
}

export interface CreateDropRequest {
  title: string;
  description: string;
  dropDate: string;        
  orderCutoffTime: string; 
  pickupLocation: string;
  pickupTime: string;
  maxOrders: number;

  dropPhotoUrl?: string;
  specialNotes?: string;
  items: {
    itemId: number;
    quantityAvailable: number;
    dropPrice?: number;
  }[];
}
