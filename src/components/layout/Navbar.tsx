'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { glowColors } from '@/constants/glowColors';
import Image from 'next/image';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = pathname.startsWith('/admin');

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getLinkClasses = (href: string) => {
    if (pathname === href) {
      return 'my-1 text-sm font-bold md:mx-4 md:my-0 text-text-primary-light dark:text-text-primary-dark';
    }
    return 'my-1 text-sm font-medium md:mx-4 md:my-0 text-text-primary-light dark:text-text-primary-dark transition-all duration-200';
  };

  const renderNavLink = (href: string, text: string, index: number) => {
    const glow = glowColors[index % glowColors.length];
    return (
      <Link
        key={href}
        href={href}
        className={`${getLinkClasses(href)} transition-all duration-300 ease-in-out transform`}
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
        {text}
      </Link>
    );
  };

  const renderButton = (text: string, onClick: () => void, index: number) => {
    const glow = glowColors[index % glowColors.length];
    return (
      <button
        key={text}
        onClick={onClick}
        className="my-1 text-sm font-medium md:mx-4 md:my-0 text-text-primary-light dark:text-text-primary-dark transition-all duration-300 transform cursor-pointer"
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
        {text}
      </button>
    );
  };

  return (
    <nav className="bg-card-light dark:bg-card-dark shadow-md border-b border-black dark:border-white">
      <div className="container mx-auto px-6 py-3 md:flex md:justify-between md:items-center">
        <div className="flex justify-between items-center w-full md:w-auto">
          {/* Logo */}
          {isAdmin ? (
            <span className="text-2xl font-bold text-secondary dark:text-secondary-dark">
              EduRecicla
            </span>
          ) : (
            <Link
              href="/"
              className="text-2xl font-bold text-secondary dark:text-secondary-dark transition-all duration-300 transform hover:scale-105"
              style={{ textShadow: "0 0 0 transparent" }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.textShadow = `0 0 8px ${glowColors[0]}`;
                el.classList.add('font-bold', 'scale-105');
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.textShadow = "0 0 0 transparent";
                el.classList.remove('font-bold', 'scale-105');
              }}
            >
              EduRecicla
            </Link>
          )}

          {/* Mobile toggle */}
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

        {/* Links */}
        <div className={`md:flex items-center ${isOpen ? 'block' : 'hidden'} w-full md:w-auto`}>
          <div className="flex flex-col md:flex-row md:mx-6 items-center gap-4 md:gap-0 w-full">
            {!isAdmin && (
              <div className="flex flex-col md:flex-row gap-4 md:gap-0 w-full">
                {renderNavLink("/buy", "Buy", 0)}
                {renderNavLink("/sell", "Sell", 1)}
                {renderNavLink("/donate", "Donate", 2)}
              </div>
            )}

            <div className="flex items-center ml-auto gap-4">
              {isLoggedIn ? (
                <>
                  {renderButton("Logout", handleLogout, 3)}
                  {!isAdmin && user && (
                    <Link href="/profile">
                      <Image
                        src={user.avatarUrl || '/default-avatar.png'}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-black dark:border-white cursor-pointer"
                      />
                    </Link>

                  )}
                </>
              ) : (
                <>
                  {renderNavLink("/login", "Login", 4)}
                  {renderNavLink("/register", "Register", 5)}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
