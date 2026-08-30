export interface Reel {
  reelId: number;
  title: string;
  mediaUrl: string;
  createdAt: string;
  // Note: the backend Reel model returns the restaurant object inside it, but for our Reel list, 
  // we may just need the reel fields. We match what the backend sends exactly.
  restaurant?: {
    restaurantId: number;
    name: string;
  };
}

export interface ReelRequest {
  title: string;
  mediaUrl: string;
}
