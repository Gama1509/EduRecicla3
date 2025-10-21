// @/components/products/ProductCard.tsx
import { Product } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link href={`/buy/${product.id}`}>
      <div className="border rounded-lg shadow-md overflow-hidden transition-transform transform hover:-translate-y-1 h-full flex flex-col">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
          <p className="text-sm text-gray-600 mt-1 flex-grow">{product.description}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-xl font-bold text-blue-DEFAULT">
              {product.isDonation ? 'Free' : `$${product.price}`}
            </span>
            <span
              className={`px-4 py-2 rounded-lg font-semibold text-white text-sm ${
                product.isDonation
                  ? 'bg-green-DEFAULT'
                  : 'bg-orange-DEFAULT'
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
