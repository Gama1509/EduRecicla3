// @/types/product.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'Laptop' | 'Tablet' | 'Monitor' | 'Accessory';
  condition: 'New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair';
  imageUrl: string;
  isDonation: boolean;
  specs?: {
    cpu?: string;
    ram?: string;
    storage?: string;
    display?: string;
  };
}
