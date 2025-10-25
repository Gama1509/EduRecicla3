// src/app/admin/products/edit/[productId]/page.tsx
import ProductForm from '@/components/admin/ProductForm';
import { products } from '@/data/products';
import { Product } from '@/types/product';

interface EditProductPageProps {
  params: { productId: string };
  searchParams?: { [key: string]: string | string[] }; // opcional
}

// Simula la obtención del producto (puedes reemplazarlo con fetch real)
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
    return (
      <div className="text-center text-text-primary-light dark:text-text-primary-dark">
        Product not found.
      </div>
    );
  }

  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md transition-colors duration-300">
      <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-8">
        Edit Product
      </h1>
      <ProductForm product={product} />
    </div>
  );
}
