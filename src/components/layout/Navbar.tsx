'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import { glowColors } from '@/constants/glowColors';
import api from '@/utils/api';
import { NotificationDto } from '@/types/notification.dto';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isLoggedIn, user, token, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Fetch notificaciones cada 1 minuto
  useEffect(() => {
    if (!token || !user) return;

    const fetchNotifications = async () => {
      try {
        const res = await api.get<NotificationDto[]>('/notification/getByUserId');
        setNotifications(res.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [token, user]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Click fuera del dropdown para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) return null;

  const isAdmin = pathname.startsWith('/admin');

  const getLinkClasses = (href: string) => {
    if (pathname === href) {
      return 'my-1 text-sm font-bold md:mx-4 md:my-0 text-text-primary-light dark:text-text-primary-dark underline';
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
        className="my-1 text-sm font-medium md:mx-4 md:my-0 text-text-primary-light dark:text-text-primary-dark transition-all duration-300 transform cursor-pointer underline"
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

  return (
    <nav className="bg-card-light dark:bg-card-dark shadow-md border-b border-black dark:border-white transition-colors duration-300">
      <div className="container mx-auto px-6 py-3 md:flex md:justify-between md:items-center">
        {/* LOGO */}
        <div className="flex justify-between items-center w-full md:w-auto">
          {isAdmin ? (
            <span className="text-2xl font-bold text-secondary dark:text-secondary-dark">EduRecicla</span>
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

        {/* LINKS */}
        <div className={`md:flex items-center ${isOpen ? 'block' : 'hidden'} w-full md:w-auto`}>
          <div className="flex flex-col md:flex-row md:mx-6 items-center gap-4 md:gap-0 w-full justify-between">
            {!isAdmin && (
              <div className="flex flex-col md:flex-row gap-4 md:gap-0 w-full justify-between">
                <div className="flex flex-col md:flex-row">
                  {renderNavLink('/buy', 'Buy', 0)}
                  {renderNavLink('/donate', 'Donate', 1, true)}
                </div>
                <div className="flex flex-col md:flex-row">
                  {renderNavLink('/sell', 'Sell', 2, true)}
                </div>
              </div>
            )}

            <div className="flex items-center ml-auto gap-4">
              {isLoggedIn ? (
                <>
                  {/* 🔔 Notificaciones */}
                  {!isAdmin && (
                    <div className="relative group" ref={dropdownRef}>
                      <Bell className="w-6 h-6 text-text-primary-light dark:text-text-primary-dark group-hover:text-secondary transition-colors cursor-pointer" />
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-white"></span>
                      )}
                      {/* Dropdown */}
                      <div className="absolute right-0 mt-2 w-80 bg-black border border-white rounded shadow-lg overflow-y-auto max-h-96 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 z-50">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-sm text-gray-300">No tienes notificaciones</div>
                        ) : (
                          notifications.map((n) => (
                            <Link
                              key={n.id}
                              href={`/notifications/${n.id}`}
                              className="block px-4 py-2 border-b border-gray-700 hover:bg-gray-800 transition-colors"
                            >
                              <div className="flex justify-between items-center">
                                <span className={`font-medium ${!n.read ? 'text-white' : 'text-gray-400'}`}>
                                  {n.title}
                                </span>
                                {!n.read && <span className="w-2 h-2 bg-red-500 rounded-full ml-2"></span>}
                              </div>
                              <div className="text-sm text-gray-300 truncate">{n.message}</div>
                              {n.product && (
                                <div className="mt-1 text-xs text-gray-400">
                                  {n.product.name} - {n.product.brand} - {n.product.price ? `$${n.product.price}` : 'N/A'}
                                </div>
                              )}
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="my-1 text-sm font-medium text-text-primary-light dark:text-text-primary-dark transition-all duration-300 transform cursor-pointer"
                  >
                    Logout
                  </button>

                  {/* Avatar */}
                  {!isAdmin && user && (
                    <Link href="/profile">
                      <img
                        src={user.avatar ? `data:image/png;base64,${user.avatar}` : '/default-avatar.png'}
                        alt="User Avatar"
                        className="rounded-full border border-black dark:border-white object-contain"
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
