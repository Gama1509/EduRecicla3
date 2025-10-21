// @/data/products.ts
import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: 1,
    name: 'Refurbished Dell Laptop',
    description: 'A reliable laptop for all your student needs.',
    price: 250,
    category: 'Laptop',
    condition: 'Used - Good',
    imageUrl: 'https://picsum.photos/seed/1/300/200',
    isDonation: false,
    specs: {
      cpu: 'Intel Core i5',
      ram: '8GB DDR4',
      storage: '256GB SSD',
      display: '14-inch FHD',
    },
  },
  {
    id: 2,
    name: 'Samsung Galaxy Tablet',
    description: 'A great tablet for taking notes and reading.',
    price: 150,
    category: 'Tablet',
    condition: 'Used - Like New',
    imageUrl: 'https://picsum.photos/seed/2/300/200',
    isDonation: false,
    specs: {
      storage: '128GB',
      display: '10.4-inch',
    },
  },
  {
    id: 3,
    name: 'HP 24-inch Monitor',
    description: 'A large monitor to boost your productivity.',
    price: 0,
    category: 'Monitor',
    condition: 'Used - Good',
    imageUrl: 'https://picsum.photos/seed/3/300/200',
    isDonation: true,
    specs: {
      display: '24-inch IPS',
    },
  },
  {
    id: 4,
    name: 'Logitech Wireless Mouse',
    description: 'A comfortable and responsive wireless mouse.',
    price: 20,
    category: 'Accessory',
    condition: 'New',
    imageUrl: 'https://picsum.photos/seed/4/300/200',
    isDonation: false,
  },
  {
    id: 5,
    name: 'Refurbished MacBook Air',
    description: 'A lightweight and powerful laptop for students.',
    price: 450,
    category: 'Laptop',
    condition: 'Used - Like New',
    imageUrl: 'https://picsum.photos/seed/5/300/200',
    isDonation: false,
    specs: {
      cpu: 'Apple M1',
      ram: '8GB',
      storage: '256GB SSD',
      display: '13.3-inch Retina',
    },
  },
];
