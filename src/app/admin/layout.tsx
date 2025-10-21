// @/app/admin/layout.tsx
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav>
          <ul>
            <li>
              <Link href="/admin" className="block py-2 px-4 hover:bg-gray-700 rounded">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/products" className="block py-2 px-4 hover:bg-gray-700 rounded">
                Products
              </Link>
            </li>
            <li>
              <Link href="/admin/proposals" className="block py-2 px-4 hover:bg-gray-700 rounded">
                Proposals
              </Link>
            </li>
            <li>
              <Link href="/admin/requests" className="block py-2 px-4 hover:bg-gray-700 rounded">
                Requests
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-100">
        {children}
      </main>
    </div>
  );
}
