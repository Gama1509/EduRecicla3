// @/app/admin/products/edit/[productId]/page.tsx
import ProductForm from '@/components/admin/ProductForm';
import { products } from '@/data/products';
import { Product } from '@/types/product';

interface EditProductPageProps {
  params: {
    productId: string;
  };
}

const getProduct = (id: number): Promise<Product | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products.find((p) => p.id === id));
    }, 200);
  });
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const productId = parseInt(params.productId, 10);
  const product = await getProduct(productId);

  if (!product) {
    return <div className="text-center">Product not found.</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  );
}
