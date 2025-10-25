'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import { fetchWithAuth } from '@/utils/api';
import { Product } from '@/types/product';

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      const getProduct = async () => {
        const data = await fetchWithAuth(`/products/${id}`);
        setProduct(data);
      };
      getProduct();
    }
  }, [id]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-8">
        Edit Product
      </h1>
      {product ? <ProductForm product={product} /> : <p>Loading...</p>}
    </div>
  );
}
