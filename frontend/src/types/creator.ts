import { FoodDropResponse } from './drop';

export type CreatorType = 
  | 'HOME_BAKER' 
  | 'TIFFIN_SERVICE' 
  | 'CAMPUS_SELLER'
  | 'WEEKEND_CHEF' 
  | 'CLOUD_KITCHEN' 
  | 'SPECIALTY_DESSERTS' 
  | 'HEALTHY_MEALS';

export type VerificationLevel = 0 | 1 | 2 | 3;

export interface CreatorSummary {
  restaurantId: number;
  name: string;
  creatorType: CreatorType;
  verificationLevel: VerificationLevel;
  avgRating: number;
  followerCount: number;
  totalOrdersCompleted: number;
  isAcceptingOrders: boolean;
  activeDrop?: FoodDropResponse;
}

export interface CreatorResponse {
  restaurantId: number;
  name: string;
  creatorType: CreatorType;
  bio: string;
  instagramHandle: string | null;
  city: string;
  cuisine: string;
  verificationLevel: VerificationLevel;
  avgRating: number;
  followerCount: number;
  totalOrdersCompleted: number;
  isAcceptingOrders: boolean;

  offersPickup: boolean;
  pickupAddress: string | null;
  verification?: Record<string, unknown>;
  activeDrops?: FoodDropResponse[];
}

export interface CreatorRegistrationRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  creatorName: string;
  whatDoYouMake: string;
  bio?: string;
  city?: string;
  pickupLocation?: string;
}
