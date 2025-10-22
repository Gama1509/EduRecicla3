// @/components/products/ProductDetail.tsx
import { Product } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';

interface ProductDetailProps {
  product: Product;
}

const ProductDetail = ({ product }: ProductDetailProps) => {
  const action = product.isDonation ? 'donate' : 'buy';
  const requestUrl = `/request?action=${action}&productId=${product.id}`;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={600}
          height={400}
          className="w-full rounded-lg shadow-md"
        />
      </div>
      <div>
        <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>
        <p className="text-lg text-gray-600 mt-4">{product.description}</p>

        <div className="mt-6">
          <span className="text-3xl font-bold text-secondary">
            {product.isDonation ? 'Free Donation' : `$${product.price}`}
          </span>
          <span className="ml-4 text-gray-500">{product.condition}</span>
        </div>

        {product.specs && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Specifications</h3>
            <ul className="space-y-2">
              {Object.entries(product.specs).map(([key, value]) => (
                <li key={key} className="flex justify-between">
                  <span className="font-semibold text-gray-700">{key.toUpperCase()}:</span>
                  <span className="text-gray-600">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8">
          <Link href={requestUrl}>
            <div
              className={`w-full text-center py-3 px-6 rounded-lg font-bold text-white transition-colors ${
                product.isDonation
                  ? 'bg-primary hover:bg-primary-600'
                  : 'bg-secondary hover:bg-secondary-600'
              }`}
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
