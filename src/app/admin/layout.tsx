import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 p-4 bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav>
          <ul>
            <li>
              <Link
                href="/admin"
                className="block py-2 px-4 rounded hover:bg-secondary hover:text-white dark:hover:bg-secondary-dark transition-colors duration-200"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/products"
                className="block py-2 px-4 rounded hover:bg-secondary hover:text-white dark:hover:bg-secondary-dark transition-colors duration-200"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/admin/proposals"
                className="block py-2 px-4 rounded hover:bg-secondary hover:text-white dark:hover:bg-secondary-dark transition-colors duration-200"
              >
                Proposals
              </Link>
            </li>
            <li>
              <Link
                href="/admin/requests"
                className="block py-2 px-4 rounded hover:bg-secondary hover:text-white dark:hover:bg-secondary-dark transition-colors duration-200"
              >
                Requests
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-background-light dark:bg-background-dark transition-colors duration-300">
        {children}
      </main>
    </div>
  );
}
