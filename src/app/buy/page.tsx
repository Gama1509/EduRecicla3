// @/app/buy/page.tsx
"use client";
import { useState } from 'react';
import FilterBar from '@/components/products/FilterBar';
import ProductGrid from '@/components/products/ProductGrid';
import { ProductFilters } from '@/services/productService';

export default function BuyPage() {
  const [filters, setFilters] = useState<ProductFilters>({
    category: 'All',
    condition: 'All',
    search: '',
    sort: 'newest',
    action: 'all',
  });

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Buy Products</h1>
      <div className="flex flex-col gap-8">
        <FilterBar filters={filters} onFilterChange={setFilters} />
        <div className="flex-1">
          <ProductGrid filters={filters} />
        </div>
      </div>
    </div>
  );
}
