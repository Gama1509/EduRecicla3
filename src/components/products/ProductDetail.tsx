// @/components/products/ProductDetail.tsx
"use client";
import { useState } from 'react';
import { Product } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';
import { glowColors } from '@/constants/glowColors';

interface ProductDetailProps {
  product: Product;
}

const ProductDetail = ({ product }: ProductDetailProps) => {
  const action = product.isDonation ? 'donate' : 'buy';
  const requestUrl = `/request?action=${action}&productId=${product.id}`;
  const [hovered, setHovered] = useState(false);
  const glow = glowColors[0]; // Puedes rotar si quieres más efectos

  return (
    <div className="grid md:grid-cols-2 gap-8 text-text-primary-light dark:text-text-primary-dark">
      <div>
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={600}
          height={400}
          className="w-full rounded-lg shadow-md transition-transform transform hover:scale-105"
        />
      </div>

      <div>
        <h1
          className="text-4xl font-bold transition-all duration-300"
          style={{ textShadow: hovered ? `0 0 8px ${glow}` : undefined }}
        >
          {product.name}
        </h1>
        <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark mt-4">
          {product.description}
        </p>

        <div className="mt-6">
          <span className="text-3xl font-bold text-secondary dark:text-secondary-dark">
            {product.isDonation ? 'Free Donation' : `$${product.price}`}
          </span>
          <span className="ml-4 text-text-secondary-light dark:text-text-secondary-dark">{product.condition}</span>
        </div>

        {product.specs && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Specifications</h3>
            <ul className="space-y-2">
              {Object.entries(product.specs).map(([key, value]) => (
                <li key={key} className="flex justify-between">
                  <span className="font-semibold">{key.toUpperCase()}:</span>
                  <span className="text-text-secondary-light dark:text-text-secondary-dark">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8">
          <Link href={requestUrl}>
            <div
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className={`w-full text-center py-3 px-6 rounded-lg font-bold text-white border border-white transition-all duration-300 transform hover:scale-105 cursor-pointer`}
              style={{
                boxShadow: hovered ? `0 0 15px ${glow}` : undefined,
              }}
            >
              {product.isDonation ? 'Request Donation' : 'Buy Now'}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
