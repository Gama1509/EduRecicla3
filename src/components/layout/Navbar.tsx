'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, MessageSquare } from 'lucide-react';
import { glowColors } from '@/constants/glowColors';
import api from '@/utils/api';
import { NotificationDto } from '@/types/notification.dto';
import { getNotificationTitle } from '@/app/notifications/views/NotificationViews';
import { getSocket } from '@/utils/sockets';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isLoggedIn, user, token, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const socket = getSocket();
  function formatDate(dateString: string | null) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses empiezan en 0
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // el 0 debe mostrarse como 12

    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  }

  useEffect(() => {
    if (!socket) return;

    const handleNotificationRead = ({ id, seenAt }: { id: string; seenAt: string }) => {
      setNotifications(prev =>
        prev.map(n =>
          n.id === id
            ? { ...n, read: true, seenAt } // actualizamos read y seenAt
            : n
        )
      );
    };

    socket.on("notification:markedAsRead", handleNotificationRead);

    return () => {
      socket.off("notification:markedAsRead", handleNotificationRead);
    };
  }, [socket]);


  useEffect(() => {
    if (!socket) return;

    const handleNotificationHidden = (data: { id: string }) => {
      setNotifications((prev) => prev.filter((n) => n.id !== data.id));
    };

    socket.on("notification:hidden", handleNotificationHidden);

    return () => {
      socket.off("notification:hidden", handleNotificationHidden);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleNotificationAdd = (notification: NotificationDto) => {
      setNotifications(prev => [notification, ...prev]);
    };

    socket.on("notification:add", handleNotificationAdd);

    return () => {
      socket.off("notification:add", handleNotificationAdd);
    };
  }, [socket]);


  useEffect(() => {
    if (!socket) return;

    const handleUnreadMessage = (data: { hasUnreadMessages: boolean }) => {
      setHasUnreadMessages(data.hasUnreadMessages);
    };

    socket.on("message:unread", handleUnreadMessage);

    return () => {
      socket.off("message:unread", handleUnreadMessage);
    };
  }, [socket]);


  useEffect(() => {
    if (!token || !user) return;

    const checkUnread = async () => {
      try {
        const res = await api.get("/chat/unread");
        setHasUnreadMessages(res.data);
      } catch (error) {
        console.error("Error verificando mensajes no leídos:", error);
      }
    };

    checkUnread();
  }, [token, user]);

  useEffect(() => setMounted(true), []);

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

  const avatarClasses = `
  w-10 h-10 md:w-12 md:h-12 rounded-full border border-black dark:border-white object-cover
  ${pathname === '/profile' ? 'ring-4 ring-green-400 shadow-[0_0_12px_rgba(0,255,0,0.8)]' : ''}
`;

  const getLinkClasses = (href: string) => {
    if (pathname === href) {

      return 'my-2 md:my-1 text-2xl font-bold md:mx-4 md:my-0 text-text-primary-light dark:text-text-primary-dark underline transform transition-all duration-200 text-center';
    }
    return 'my-2 md:my-1 text-lg font-medium md:mx-4 md:my-0 text-text-primary-light dark:text-text-primary-dark transition-all duration-200 text-center';
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
          el.classList.add('font-bold', 'scale-130');
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.textShadow = '0 0 0 transparent';
          el.classList.remove('font-bold', 'scale-130');
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


  return (
    <nav className="w-full bg-card-light dark:bg-card-dark shadow-md border-b border-black dark:border-white transition-colors duration-300">
      <div className="container mx-auto px-6 py-3 md:flex md:justify-between md:items-center">
        <div className="flex justify-between items-center">
          {isAdmin ? (
            <span className="text-2xl font-bold text-secondary dark:text-secondary-dark">EduRecicla</span>
          ) : (
            <Link href="/">
              <span
                className="text-2xl font-bold text-secondary dark:text-secondary-dark transition-all duration-300 transform hover:scale-105"
                style={{ textShadow: "0 0 0 transparent" }}
                suppressHydrationWarning={true}
              >
                EduRecicla
              </span>
            </Link>
          )}

          {/* Mobile menu button */}
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

        {/* Mobile Menu open: "block", Menu closed: "hidden" */}
        <div className={`md:flex items-center ${isOpen ? 'block' : 'hidden'} w-full md:w-auto`}>
          <div className="flex flex-col md:flex-row md:items-center w-full">
            {!isAdmin && (
              <div className="flex flex-col md:flex-row md:space-x-6 w-full md:w-auto mt-4 md:mt-0">
                {renderNavLink("/buy", "Comprar", 0)}
                {renderNavLink("/donate", "Donar", 1)}
                {renderNavLink("/sell", "Vender", 2)}
              </div>
            )}

            <div className="flex flex-col md:flex-row items-center md:ml-auto gap-4 mt-4 md:mt-0">
              {isLoggedIn ? (
                <>
                  {!isAdmin && (
                    <div className="flex items-center gap-4">
                      <div
                        className="relative"
                        ref={dropdownRef}
                        onMouseEnter={() => {
                          if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                          setDropdownOpen(true);
                        }}
                        onMouseLeave={() => {
                          closeTimeoutRef.current = setTimeout(() => setDropdownOpen(false), 300);
                        }}
                      >
                        <Bell className="w-6 h-6 text-text-primary-light dark:text-text-primary-dark hover:text-secondary transition-colors cursor-pointer" />
                        {unreadCount > 0 && (
                          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-white"></span>
                        )}
                        <div
                          className={`absolute right-0 mt-2 w-80 bg-black border border-white rounded shadow-lg overflow-y-auto max-h-96 transition-all duration-200 z-50 ${dropdownOpen
                            ? "opacity-100 translate-y-0 pointer-events-auto"
                            : "opacity-0 -translate-y-2 pointer-events-none"
                            }`}
                        >
                          {notifications.length === 0 ? (
                            <div className="p-4 text-sm text-gray-300">No tienes notificaciones</div>
                          ) : (
                            notifications.map((n) => (
                              <Link
                                key={n.id}
                                href={`/notifications/${n.id}`}
                                className="block px-4 py-2 border-b border-gray-700 transition-all duration-200 hover:scale-105 relative"
                              >
                                <div className="flex justify-between items-center">
                                  <span className={`font-medium ${!n.read ? "text-white" : "text-gray-400"}`}>
                                    {getNotificationTitle(n.type)}
                                  </span>
                                  {!n.read && <span className="w-2 h-2 bg-red-500 rounded-full ml-2"></span>}
                                </div>
                                <div className="text-sm text-gray-300 truncate">{n.message}</div>
                                {n.product && (
                                  <div className="mt-1 text-xs text-gray-400">
                                    {n.product.name} - {n.product.brand} - {n.product.price ? `$${n.product.price}` : "N/A"}
                                  </div>
                                )}
                                <div className="mt-1 flex justify-between text-xs text-gray-400">
                                  <span>{n.seenAt ? formatDate(n.seenAt) : ""}</span>
                                  <span>{formatDate(n.createdAt)}</span>
                                </div>
                              </Link>
                            ))
                          )}
                        </div>
                      </div>
                      <Link href="/chats/" className="relative">
                        <MessageSquare className="w-6 h-6 text-text-primary-light dark:text-text-primary-dark hover:text-secondary transition-colors cursor-pointer" />
                        {hasUnreadMessages && (
                          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-white"></span>
                        )}
                      </Link>
                    </div>
                  )}

                  <button
                    onClick={handleLogout}
                    className="my-2 md:my-0 text-lg font-medium text-text-primary-light dark:text-text-primary-dark transition-all duration-300 ease-in-out transform cursor-pointer"
                    style={{ textShadow: "0 0 0 transparent" }}
                  >
                    Cerrar sesión
                  </button>

                  {!isAdmin && user && (
                    <Link href="/profile" className="flex flex-col md:flex-row items-center space-x-0 md:space-x-2">
                      <img
                        src={
                          user.avatar && user.avatar.startsWith("http")
                            ? user.avatar
                            : "https://imagenes.20minutos.es/uploads/imagenes/2024/05/15/una-imagen-creada-por-la-herramienta-imagen-3-de-google-1.jpeg"
                        }
                        alt="User Avatar"
                        className={avatarClasses}
                      />
                      <span className="font-bold text-lg text-black dark:text-white mt-2 md:mt-0">{user.name}</span>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  {renderNavLink("/login", "Iniciar sesión", 4)}
                  {renderNavLink("/register", "Registrate", 5)}
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
