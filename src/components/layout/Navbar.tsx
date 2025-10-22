// @/components/layout/Navbar.tsx
"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3 md:flex md:justify-between md:items-center">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-secondary">
            EduRecicla
          </Link>
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
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
            <Link href="/buy" className="my-1 text-sm text-gray-700 font-medium hover:text-secondary md:mx-4 md:my-0">
              Buy
            </Link>
            <Link href="/sell" className="my-1 text-sm text-gray-700 font-medium hover:text-secondary md:mx-4 md:my-0">
              Sell
            </Link>
            <Link href="/donate" className="my-1 text-sm text-gray-700 font-medium hover:text-secondary md:mx-4 md:my-0">
              Donate
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/profile" className="my-1 text-sm text-gray-700 font-medium hover:text-secondary md:mx-4 md:my-0">
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="my-1 text-sm text-gray-700 font-medium hover:text-secondary md:mx-4 md:my-0"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="my-1 text-sm text-gray-700 font-medium hover:text-secondary md:mx-4 md:my-0">
                  Login
                </Link>
                <Link href="/register" className="my-1 text-sm text-gray-700 font-medium hover:text-secondary md:mx-4 md:my-0">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
