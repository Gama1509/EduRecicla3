"use client";
import Link from 'next/link';
import { glowColors } from '@/constants/glowColors';

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
            {[
              { href: "/admin", label: "Dashboard" },
              { href: "/admin/products", label: "Products" },
              { href: "/admin/proposals", label: "Proposals" },
            ].map((item, index) => {
              const glow = glowColors[index % glowColors.length];
              return (
                <li key={item.href} className="mb-2">
                  <Link
                    href={item.href}
                    className={`block py-2 px-4 rounded transition-all duration-300 font-medium transform`}
                    style={{ textShadow: "0 0 0 transparent" }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.textShadow = `0 0 8px ${glow}`;
                      el.classList.add('font-bold', 'scale-105');
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.textShadow = "0 0 0 transparent";
                      el.classList.remove('font-bold', 'scale-105');
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
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
