"use client";
import { Product } from '@/types/product';
import { useRouter } from 'next/navigation';

interface ProductFormProps {
  product?: Product;
}

const categories = ['Laptop', 'Tablet', 'Monitor', 'Accessory'];
const conditions = ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'];

const ProductForm = ({ product }: ProductFormProps) => {
  const router = useRouter();
  const isEditMode = !!product;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`Simulating ${isEditMode ? 'updating' : 'creating'} product...`);
    router.push('/admin/products');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-6 rounded-lg shadow-md transition-colors duration-300 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name */}
          <div>
            <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
              Product Name
            </label>
            <input
              type="text"
              defaultValue={product?.name}
              className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-dark"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
              Category
            </label>
            <select
              defaultValue={product?.category}
              className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-dark"
            >
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
              Condition
            </label>
            <select
              defaultValue={product?.condition}
              className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-dark"
            >
              {conditions.map((condition) => (
                <option key={condition} value={condition}>{condition}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
              Price ($)
            </label>
            <input
              type="number"
              defaultValue={product?.price}
              className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-dark"
              required
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
              Description
            </label>
            <textarea
              rows={3}
              defaultValue={product?.description}
              className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-dark"
              required
            />
          </div>

          {/* Image URL */}
          <div className="md:col-span-2">
            <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
              Image URL
            </label>
            <input
              type="text"
              defaultValue={product?.imageUrl}
              className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-dark"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="w-full bg-secondary text-white font-bold py-3 px-6 rounded-lg hover:bg-secondary-600 dark:bg-secondary-dark dark:hover:bg-secondary-dark-hover transition-colors duration-200"
        >
          {isEditMode ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
