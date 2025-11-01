'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { glowColors } from '@/constants/glowColors';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

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

  const renderNavLink = (href: string, text: string, index: number, requiresAuth = false) => {
    const glow = glowColors[index % glowColors.length];
    return (
      <a
        key={href}
        href={href}
        className={`${getLinkClasses(href)} transition-all duration-300 ease-in-out transform`}
        style={{ textShadow: '0 0 0 transparent' }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.textShadow = `0 0 8px ${glow}`;
          el.classList.add('font-bold', 'scale-105');
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.textShadow = '0 0 0 transparent';
          el.classList.remove('font-bold', 'scale-105');
        }}
        onClick={(e) => {
          if (requiresAuth && !isLoggedIn) {
            e.preventDefault();
            router.push('/login');
          }
        }}
      >
        <span suppressHydrationWarning={true}>{text}</span>
      </a>
    );
  };


  const renderButton = (text: string, onClick: () => void, index: number) => {
    const glow = glowColors[index % glowColors.length];
    return (
      <button
        key={text}
        onClick={onClick}
        className="my-1 text-sm font-medium md:mx-4 md:my-0 text-text-primary-light dark:text-text-primary-dark transition-all duration-300 transform cursor-pointer"
        style={{ textShadow: '0 0 0 transparent' }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.textShadow = `0 0 8px ${glow}`;
          el.classList.add('font-bold', 'scale-105');
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.textShadow = '0 0 0 transparent';
          el.classList.remove('font-bold', 'scale-105');
        }}
      >
        <span suppressHydrationWarning={true}>{text}</span>
      </button>
    );
  };

  if (!mounted) return null; // ✅ Renderiza solo en cliente

  return (
    <nav className="bg-card-light dark:bg-card-dark shadow-md border-b border-black dark:border-white transition-colors duration-300">
      <div className="container mx-auto px-6 py-3 md:flex md:justify-between md:items-center">
        <div className="flex justify-between items-center w-full md:w-auto">
          {/* Logo */}
          {isAdmin ? (
            <span className="text-2xl font-bold text-secondary dark:text-secondary-dark">
              EduRecicla
            </span>
          ) : (
            <Link href="/">
              <span
                className="text-2xl font-bold text-secondary dark:text-secondary-dark transition-all duration-300 transform hover:scale-105"
                style={{ textShadow: '0 0 0 transparent' }}
                suppressHydrationWarning={true}
              >
                EduRecicla
              </span>
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
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
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
                {renderNavLink('/buy', 'Buy', 0)}   
                {renderNavLink('/sell', 'Sell', 1, true)} 
                {renderNavLink('/donate', 'Donate', 2, true)}
              </div>
            )}


            <div className="flex items-center ml-auto gap-4">
              {isLoggedIn ? (
                <>
                  {renderButton('Logout', handleLogout, 3)}
                  {!isAdmin && user && (
                    <Link href="/profile">
                      <img
                        src={user.avatar ? `data:image/png;base64,${user.avatar}` : '/default-avatar.png'}
                        alt="User Avatar"
                        className="w-20 h-12 rounded-full border border-black dark:border-white object-cover"
                      />
                    </Link>


                  )}
                </>
              ) : (
                <>
                  {renderNavLink('/login', 'Login', 4)}
                  {renderNavLink('/register', 'Register', 5)}
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
