import Link from 'next/link';
import { products } from '@/data/products';

export default function AdminProductsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
          Manage Products
        </h1>
        <Link href="/admin/products/new">
          <div className="bg-secondary dark:bg-secondary-dark text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary-600 dark:hover:bg-secondary-hover transition-colors">
            Add New Product
          </div>
        </Link>
      </div>

      <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-6 rounded-lg shadow-md transition-colors duration-300">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-border-light dark:border-border-dark">
              <th className="py-2 px-4 text-left text-text-primary-light dark:text-text-primary-dark">Name</th>
              <th className="py-2 px-4 text-left text-text-primary-light dark:text-text-primary-dark">Category</th>
              <th className="py-2 px-4 text-left text-text-primary-light dark:text-text-primary-dark">Price</th>
              <th className="py-2 px-4 text-left text-text-primary-light dark:text-text-primary-dark">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="py-2 px-4 text-text-primary-light dark:text-text-primary-dark">{product.name}</td>
                <td className="py-2 px-4 text-text-primary-light dark:text-text-primary-dark">{product.category}</td>
                <td className="py-2 px-4 text-text-primary-light dark:text-text-primary-dark">{product.isDonation ? 'Donation' : `$${product.price}`}</td>
                <td className="py-2 px-4">
                  <Link
                    href={`/admin/products/edit/${product.id}`}
                    className="text-yellow-600 dark:text-yellow-400 hover:underline"
                  >
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
