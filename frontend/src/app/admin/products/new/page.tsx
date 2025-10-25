// @/app/admin/products/new/page.tsx
import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-8">
        Add New Product</h1>
      <ProductForm />
    </div>
  );
}
