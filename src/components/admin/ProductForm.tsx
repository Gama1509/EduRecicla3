// @/components/admin/ProductForm.tsx
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
    // Simulate form submission
    alert(`Simulating ${isEditMode ? 'updating' : 'creating'} product...`);
    router.push('/admin/products');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Product Name</label>
          <input
            type="text"
            id="name"
            defaultValue={product?.name}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-DEFAULT"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-gray-700 font-semibold mb-2">Category</label>
          <select
            id="category"
            defaultValue={product?.category}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-DEFAULT"
          >
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div>
          <label htmlFor="condition" className="block text-gray-700 font-semibold mb-2">Condition</label>
          <select
            id="condition"
            defaultValue={product?.condition}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-DEFAULT"
          >
            {conditions.map((condition) => (
              <option key={condition} value={condition}>{condition}</option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-gray-700 font-semibold mb-2">Price ($)</label>
          <input
            type="number"
            id="price"
            defaultValue={product?.price}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-DEFAULT"
            required
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea
            id="description"
            rows={4}
            defaultValue={product?.description}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-DEFAULT"
            required
          ></textarea>
        </div>

        {/* Image URL */}
        <div className="md:col-span-2">
          <label htmlFor="imageUrl" className="block text-gray-700 font-semibold mb-2">Image URL</label>
          <input
            type="text"
            id="imageUrl"
            defaultValue={product?.imageUrl}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-DEFAULT"
            required
          />
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          className="w-full bg-blue-DEFAULT text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {isEditMode ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
