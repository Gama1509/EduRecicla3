'use client';
import Link from 'next/link';
import { products } from '@/data/products';
import { glowColors } from '@/constants/glowColors';

export default function AdminProductsPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
          Manage Products
        </h1>
        <Link href="/admin/products/new">
          <div
            className="bg-secondary dark:bg-secondary-dark font-bold py-2 px-4 rounded-lg transition-all duration-300 cursor-pointer text-black dark:text-white"
            style={{ textShadow: "0 0 0 transparent" }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              const glowColor = 'rgba(16,185,129,0.8)'; // verde
              el.style.textShadow = `0 0 10px ${glowColor}`;
              el.style.fontWeight = 'bold';
              el.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.textShadow = '0 0 0 transparent';
              el.style.fontWeight = '';
              el.style.transform = '';
            }}
          >
            Add New Product
          </div>
        </Link>



      </div>

      {/* Table Container */}
      <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-6 rounded-lg shadow-md transition-colors duration-300 overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-border-light dark:border-border-dark">
              <th className="py-2 px-4 text-left text-text-primary-light dark:text-text-primary-dark">
                Name
              </th>
              <th className="py-2 px-4 text-left text-text-primary-light dark:text-text-primary-dark">
                Category
              </th>
              <th className="py-2 px-4 text-left text-text-primary-light dark:text-text-primary-dark">
                Price
              </th>
              <th className="py-2 px-4 text-left text-text-primary-light dark:text-text-primary-dark">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => {
              // Alternar entre los 9 colores
              const rowGlow = glowColors[index % glowColors.length];

              return (
                <tr
                  key={product.id}
                  className="border-b border-border-light dark:border-border-dark transition-all duration-300 transform cursor-pointer"
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = `0 0 15px ${rowGlow}`;
                    el.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = '';
                    el.style.transform = '';
                  }}
                >
                  <td className="py-2 px-4 text-text-primary-light dark:text-text-primary-dark">
                    {product.name}
                  </td>
                  <td className="py-2 px-4 text-text-primary-light dark:text-text-primary-dark">
                    {product.category}
                  </td>
                  <td className="py-2 px-4 text-text-primary-light dark:text-text-primary-dark">
                    {product.isDonation ? 'Donation' : `$${product.price}`}
                  </td>
                  <td className="py-2 px-4 flex gap-4">
                    {/* Edit */}
                    <Link
                      href={`/admin/products/edit/${product.id}`}
                      className="text-yellow-600 transition-all duration-300 transform cursor-pointer"
                      style={{ textShadow: "0 0 0 transparent" }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.textShadow = '0 0 10px yellow';
                        el.style.fontWeight = 'bold';
                        el.style.textDecoration = 'underline';
                        el.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.textShadow = '0 0 0 transparent';
                        el.style.fontWeight = '';
                        el.style.textDecoration = '';
                        el.style.transform = '';
                      }}
                    >
                      Edit
                    </Link>

                    {/* Delete */}
                    <button
                      className="text-red-600 transition-all duration-300 transform cursor-pointer"
                      style={{ textShadow: "0 0 0 transparent" }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.textShadow = '0 0 10px red';
                        el.style.fontWeight = 'bold';
                        el.style.textDecoration = 'underline';
                        el.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.textShadow = '0 0 0 transparent';
                        el.style.fontWeight = '';
                        el.style.textDecoration = '';
                        el.style.transform = '';
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
