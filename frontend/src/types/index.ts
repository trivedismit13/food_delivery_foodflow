export * from './auth';
export * from './creator';
export * from './drop';
export * from './order';
export * from './menu';
export * from './analytics';
export * from './notification';
export * from './pagination';

export interface SubmitRatingRequest {
  restaurantId: number;
  ratingValue: number;
  foodQualityRating?: number;

  packagingRating?: number;
  reviewText?: string;
}

export interface RatingResponse {
  ratingId: number;
  orderId: number;
  score: number;
  reviewText: string;
  createdAt: string;
  customerName: string;
}
