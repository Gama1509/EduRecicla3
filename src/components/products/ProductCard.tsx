// @/components/products/ProductCard.tsx
import { Product } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  glowColor: string;
}

const ProductCard = ({ product, glowColor }: ProductCardProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={`/buy/${product.id}`}>
      <div
        className="border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 h-full flex flex-col"
        style={{
          boxShadow: hovered
            ? `0 0 15px ${glowColor}`
            : undefined,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative w-full h-48 sm:h-56">
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="w-full h-full"
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3
            className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark transition-all duration-300"
            style={{ textShadow: hovered ? `0 0 8px ${glowColor}` : undefined }}
          >
            {product.name}
          </h3>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1 flex-grow">{product.description}</p>
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <span className="text-xl font-bold text-secondary dark:text-secondary-dark mb-2 sm:mb-0">
              {product.isDonation ? 'Gratis' : `$${product.price}`}
            </span>
            <span
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold text-white text-xs sm:text-sm ${
                product.isDonation
                  ? 'bg-primary dark:bg-primary-dark'
                  : 'bg-secondary dark:bg-secondary-dark'
              }`}
            >
              {product.isDonation ? 'Donación' : 'En venta'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
