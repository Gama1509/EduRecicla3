"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = pathname.startsWith('/admin');

  const handleLogout = () => {
    logout();
    if (isAdmin) router.push('/');
  };

  const getLinkClasses = (href: string) => {
    if (pathname === href) {
      return 'my-1 text-sm font-bold md:mx-4 md:my-0 text-text-primary-light dark:text-text-primary-dark';
    }
    return 'my-1 text-sm font-medium md:mx-4 md:my-0 text-text-primary-light dark:text-text-primary-dark hover:text-secondary dark:hover:text-secondary-dark hover:underline transition-all duration-200';
  };

  return (
    <nav className="bg-card-light dark:bg-card-dark shadow-md">
      <div className="container mx-auto px-6 py-3 md:flex md:justify-between md:items-center">
        <div className="flex justify-between items-center">
          {/* Si no es admin, EduRecicla lleva al home */}
          {isAdmin ? (
            <span className="text-2xl font-bold text-secondary dark:text-secondary-dark">
              EduRecicla
            </span>
          ) : (
            <Link
              href="/"
              className="text-2xl font-bold text-secondary dark:text-secondary-dark hover:underline"
            >
              EduRecicla
            </Link>
          )}

          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-text-secondary-light hover:text-secondary focus:outline-none focus:text-secondary dark:text-text-secondary-dark dark:hover:text-secondary-dark dark:focus:text-secondary-dark"
              aria-label="toggle menu"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                <path
                  fillRule="evenodd"
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <div className={`md:flex items-center ${isOpen ? 'block' : 'hidden'}`}>
          <div className="flex flex-col md:flex-row md:mx-6">
            {isAdmin ? (
              isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="my-1 text-sm font-medium md:mx-4 md:my-0 text-text-primary-light dark:text-text-primary-dark hover:text-secondary dark:hover:text-secondary-dark hover:underline transition-all duration-200"
                >
                  Logout
                </button>
              )
            ) : (
              <>
                <Link href="/buy" className={getLinkClasses('/buy')}>Buy</Link>
                <Link href="/sell" className={getLinkClasses('/sell')}>Sell</Link>
                <Link href="/donate" className={getLinkClasses('/donate')}>Donate</Link>

                {isLoggedIn ? (
                  <>
                    <Link href="/profile" className={getLinkClasses('/profile')}>Profile</Link>
                    <button
                      onClick={handleLogout}
                      className="my-1 text-sm font-medium md:mx-4 md:my-0 text-text-primary-light dark:text-text-primary-dark hover:text-secondary dark:hover:text-secondary-dark hover:underline transition-all duration-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className={getLinkClasses('/login')}>Login</Link>
                    <Link href="/register" className={getLinkClasses('/register')}>Register</Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
