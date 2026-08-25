export interface MenuItemResponse {
  menuItemId: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  category: string;
}
