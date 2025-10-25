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
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="p-4 flex flex-col flex-grow">
          <h3
            className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark transition-all duration-300"
            style={{ textShadow: hovered ? `0 0 8px ${glowColor}` : undefined }}
          >
            {product.name}
          </h3>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1 flex-grow">{product.description}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-xl font-bold text-secondary dark:text-secondary-dark">
              {product.isDonation ? 'Free' : `$${product.price}`}
            </span>
            <span
              className={`px-4 py-2 rounded-lg font-semibold text-white text-sm ${
                product.isDonation
                  ? 'bg-primary dark:bg-primary-dark'
                  : 'bg-secondary dark:bg-secondary-dark'
              }`}
            >
              {product.isDonation ? 'Donation' : 'For Sale'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
