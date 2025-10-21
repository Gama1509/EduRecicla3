// @/components/products/ProductGrid.tsx
"use client";
import { useEffect, useState } from 'react';
import { getProducts, ProductFilters } from '@/services/productService';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';

interface ProductGridProps {
  filters: ProductFilters;
}

const ProductGrid = ({ filters }: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts(filters);
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  if (loading) {
    return <div className="text-center">Loading products...</div>;
  }

  if (products.length === 0) {
    return <div className="text-center">No products found.</div>;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
