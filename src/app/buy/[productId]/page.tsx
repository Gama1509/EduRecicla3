// @/app/buy/[productId]/page.tsx
import ProductDetail from '@/components/products/ProductDetail';
import { products } from '@/data/products';
import { Product } from '@/types/product';

interface ProductPageProps {
  params: {
    productId: string;
  };
}

// This function is for generating static pages at build time
export async function generateStaticParams() {
  return products.map((product) => ({
    productId: product.id.toString(),
  }));
}

const getProduct = (id: number): Promise<Product | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products.find((p) => p.id === id));
    }, 200);
  });
};

export default async function ProductPage({ params }: ProductPageProps) {
  const productId = parseInt(params.productId, 10);
  const product = await getProduct(productId);

  if (!product) {
    return <div className="text-center">Product not found.</div>;
  }

  return (
    <div>
      <ProductDetail product={product} />
    </div>
  );
}
