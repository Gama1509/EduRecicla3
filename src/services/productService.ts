// @/services/productService.ts
import { products } from '@/data/products';
import { Product } from '@/types/product';

export interface ProductFilters {
  category: string;
  condition: string;
  search?: string;
  sort?: string;
  action?: 'forSale' | 'forDonation' | 'all';
}

export const getProducts = (filters: ProductFilters): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredProducts = products;

      if (filters.search) {
        filteredProducts = filteredProducts.filter((p) =>
          p.name.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }

      if (filters.category !== 'All') {
        filteredProducts = filteredProducts.filter(
          (p) => p.category === filters.category
        );
      }

      if (filters.condition !== 'All') {
        filteredProducts = filteredProducts.filter(
          (p) => p.condition === filters.condition
        );
      }

      if (filters.action === 'forSale') {
        filteredProducts = filteredProducts.filter((p) => !p.isDonation);
      } else if (filters.action === 'forDonation') {
        filteredProducts = filteredProducts.filter((p) => p.isDonation);
      }

      if (filters.sort === 'price-asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
      } else if (filters.sort === 'price-desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
      } else {
        // Default sort by newest (assuming higher id is newer)
        filteredProducts.sort((a, b) => b.id - a.id);
      }

      resolve(filteredProducts);
    }, 500); // Simulate network delay
  });
};
