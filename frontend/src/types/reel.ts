export interface Reel {
  reelId: number;
  title: string;
  mediaUrl: string;
  createdAt: string;
  restaurantId: number;
  restaurantName: string;
}

export interface ReelRequest {
  title: string;
  mediaUrl: string;
}
