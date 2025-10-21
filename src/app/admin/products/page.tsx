// @/app/admin/products/page.tsx
import Link from 'next/link';
import { products } from '@/data/products';

export default function AdminProductsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
        <Link href="/admin/products/new">
          <div className="bg-blue-DEFAULT text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">
            Add New Product
          </div>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{product.name}</td>
                <td className="py-2 px-4">{product.category}</td>
                <td className="py-2 px-4">{product.isDonation ? 'Donation' : `$${product.price}`}</td>
                <td className="py-2 px-4">
                  <Link href={`/admin/products/edit/${product.id}`} className="text-blue-600 hover:underline">
                    Edit
                  </Link>
                  <button className="ml-4 text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
