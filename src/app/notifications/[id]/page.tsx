"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import classNames from "classnames";

import { AnyNotification } from "@/types/notifications/any-notification.dto";
import { NotificationType } from "@/types/notifications/notification-type.enum";
import {
  BuyerCancelledTransactionView,
  BuyerWaitAnyView,
  BuyerWaitFullView,
  CompletionConfirmedBuyerView,
  CompletionConfirmedSellerView,
  DeliveryMarkedView,
  getNotificationTitle,
  InterestAcceptedView,
  InterestCancelledView,
  InterestMarkedView,
  InterestRejectedView,
  NotifyAvailableAnyView,
  NotifyAvailableFullView,
  ProductAcceptedView,
  ProductRejectedView,
  SellerCancelledTransactionView,
  SoldOutPartialView,
  SoldOutTotalView,
} from "../views/NotificationViews";

import api from "@/utils/api";
import { getGlowColor } from "@/utils/getGlowColor";
import { getSocket } from "@/utils/sockets";
import { useAuth } from "@/contexts/AuthContext";
import Swal from "sweetalert2";

export default function NotificationsPage() {
  const router = useRouter();
  const params = useParams();
  const selectedId = params.id;
  const { user, logout } = useAuth();

  const [notifications, setNotifications] = useState<AnyNotification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<AnyNotification | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<NotificationType | "">("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const socket = getSocket();
  const notificationTypeSpanish: Record<NotificationType, string> = {
    [NotificationType.PRODUCT_ACCEPTED]: 'Producto aceptado',
    [NotificationType.PRODUCT_REJECTED]: 'Producto rechazado',
    [NotificationType.INTEREST_MARKED]: 'Interés marcado',
    [NotificationType.INTEREST_ACCEPTED]: 'Interés aceptado',
    [NotificationType.INTEREST_REJECTED]: 'Interés rechazado',
    [NotificationType.INTEREST_CANCELLED]: 'Interés cancelado',
    [NotificationType.SELLER_CANCELLED_TRANSACTION]: 'Cancelación del vendedor',
    [NotificationType.BUYER_CANCELLED_TRANSACTION]: 'Cancelación del comprador',
    [NotificationType.DELIVERY_MARKED]: 'Entrega marcada',
    [NotificationType.COMPLETION_CONFIRMED_BUYER]: 'Confirmación de finalización por comprador',
    [NotificationType.COMPLETION_CONFIRMED_SELLER]: 'Confirmación de finalización por vendedor',
    [NotificationType.SOLD_OUT_TOTAL]: 'Agotado total',
    [NotificationType.SOLD_OUT_PARTIAL]: 'Agotado parcial',
    [NotificationType.NOTIFY_AVAILABLE_ANY]: 'Notificar disponibilidad parcial',
    [NotificationType.NOTIFY_AVAILABLE_FULL]: 'Notificar disponibilidad total',
    [NotificationType.BUYER_WAIT_ANY]: 'Esperando comprador parcial',
    [NotificationType.BUYER_WAIT_FULL]: 'Esperando comprador total',
  };


  useEffect(() => {
    if (!socket) return;

    const handleNotificationReadConfirmed = (notificationId: string) => {
      setNotifications(prev =>
        prev
          .filter(n => n !== null) // ← evita nulls
          .map(n => (n.id === notificationId ? { ...n, read: true } : n))
      );


      if (selectedNotification?.id === notificationId) {
        setSelectedNotification(prev =>
          prev ? { ...prev, read: true } : prev
        );
      }

    };

    socket.on("notification:read:confirmed", handleNotificationReadConfirmed);

    return () => {
      socket.off("notification:read:confirmed", handleNotificationReadConfirmed);
    };
  }, [socket, selectedNotification]);


  useEffect(() => {
    if (!socket) return;

    // --- Nueva notificación recibida ---
    const handleNewNotification = () => {
      // Recargar la página para actualizar la lista
      window.location.reload();
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
    };
  }, [socket]);


  // --- Traer todas las notificaciones ---
  const fetchNotifications = async () => {
    try {
      const res = await api.get<AnyNotification[]>("/notification/getNotifications");
      setNotifications(res.data);
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // --- Selección según URL ---
  useEffect(() => {
    if (!notifications.length || !selectedId || !user) return;

    // 🔒 Filtrar valores null/undefined
    const validNotifications = notifications.filter(n => n && n.id);

    // 🔍 Buscar si la notificación existe
    const found = validNotifications.find(n => n.id === selectedId);

    // 🚨 Si NO existe → el usuario trató de acceder manualmente
    if (!found) {
      Swal.fire({
        icon: "error",
        title: "Notificación inexistente",
        text: "No tienes permiso para acceder aquí. Tu sesión se cerrará.",
      });

      logout();
      router.push("/");
      return;
    }

    // 🚨 Si existe pero NO pertenece al usuario
    if (found.user_see_id !== user.uuid) {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "No tienes permiso para ver esta notificación. Tu sesión se cerrará.",
      });

      logout();
      router.push("/");
      return;
    }

    // ✔ Si todo está bien, cargar la notificación
    setSelectedNotification(found);
    markAsRead(found);

  }, [selectedId, notifications, user]);



  // Emite al backend que quiero marcar la notificación como leída
  const markAsRead = (notification: AnyNotification) => {
    if (!notification.read) {
      socket?.emit("notification:read:request", notification.id);
    }
  };

  const handleSelect = (notification: AnyNotification) => {
    router.push(`/notifications/${notification.id}`);
    setSelectedNotification(notification);
    markAsRead(notification);
  };

  // --- Filtrado y búsqueda ---
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (!n) return false; // Ignorar notificaciones nulas

      const title = getNotificationTitle(n.type)?.toLowerCase() || "";
      const message = n.message?.toLowerCase() || "";
      const term = search.toLowerCase();

      // Buscar en título y mensaje
      let matchesSearch = title.includes(term) || message.includes(term);

      // Buscar en nombre del producto
      if (!matchesSearch && n.product?.name) {
        matchesSearch = n.product.name.toLowerCase().includes(term);
      }

      // Buscar en nombre de vendedor o comprador según el tipo
      if (!matchesSearch) {
        if ('sellerInfo' in n && n.sellerInfo?.user_name) {
          matchesSearch = n.sellerInfo.user_name.toLowerCase().includes(term);
        } else if ('buyerInfo' in n && n.buyerInfo?.user_name) {
          matchesSearch = n.buyerInfo.user_name.toLowerCase().includes(term);
        }
      }

      // Filtrado por tipo
      const matchesType = typeFilter ? n.type === typeFilter : true;

      // Filtrado por fecha
      const created = new Date(n.createdAt);
      const matchesDateFrom = dateFrom ? created >= new Date(dateFrom) : true;
      const matchesDateTo = dateTo ? created <= new Date(dateTo) : true;

      return matchesSearch && matchesType && matchesDateFrom && matchesDateTo;
    });
  }, [notifications, search, typeFilter, dateFrom, dateTo]);


  const clearFilters = () => {
    setSearch("");
    setTypeFilter("");
    setDateFrom("");
    setDateTo("");
  };


  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
      {/* Panel izquierdo: lista y filtros */}
      <div className="w-1/3 border-r border-gray-300 flex flex-col">
        {/* Search + Filtros */}
        <div className="p-4 flex flex-col gap-2">
          {/* Barra de búsqueda */}
          <div className="relative mb-4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Buscar por título, mensaje, producto o usuario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 p-2 rounded-lg border border-gray-400 dark:border-white bg-white dark:bg-white/10 text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-secondary transition"
            />
          </div>

          {/* Filtro por tipo */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as NotificationType)}
            className="flex-1 min-w-[140px] px-4 py-2 rounded bg-black/80 border border-white text-white mb-4"
          >
            <option value="">Todos los tipos</option>
            {Object.values(NotificationType).map(t => (
              <option key={t} value={t}>{notificationTypeSpanish[t]}</option>
            ))}
          </select>

          {/* Filtro por fecha */}
          <div className="flex gap-2 mb-4">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="flex-1 px-2 py-1 rounded border border-gray-400 dark:border-white bg-white dark:bg-white/10 text-text-primary-light dark:text-text-primary-dark"
              placeholder="Desde"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="flex-1 px-2 py-1 rounded border border-gray-400 dark:border-white bg-white dark:bg-white/10 text-text-primary-light dark:text-text-primary-dark"
              placeholder="Hasta"
            />
          </div>

          <button
            onClick={clearFilters}
            className="flex-1 min-w-[140px] px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white font-semibold transition-all duration-300 hover:bg-gray-600 hover:text-white hover:text-lg mb-8"
          >
            Limpiar filtros
          </button>
        </div>

        {/* Lista de notificaciones */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-4 text-gray-400">No hay notificaciones</div>
          ) : (
            filteredNotifications.map((n, i) => {
              const glow = getGlowColor(i % 5);

              // Formatear fecha
              const date = new Date(n.createdAt);
              const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")
                }/${date.getFullYear()}`;

              return (
                <div
                  key={n.id}
                  onClick={() => handleSelect(n)}
                  className={classNames(
                    "cursor-pointer p-4 border flex items-center justify-between rounded-lg m-2 transition-all duration-300",
                    {
                      "bg-gray-100 dark:bg-white/10 border-blue-500": n.id === selectedNotification?.id,
                      "bg-white dark:bg-white/5 hover:scale-105 border-gray-200 dark:border-white/5": n.id !== selectedNotification?.id,
                    }
                  )}
                  style={{ boxShadow: "0 0 0 transparent" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 15px ${glow}`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 transparent";
                  }}
                >
                  <div className="flex-1 min-w-0">
                    {/* Fecha arriba */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{formattedDate}</p>

                    {/* Título */}
                    <p className="font-medium text-text-primary-light dark:text-text-primary-dark truncate">
                      {getNotificationTitle(n.type)}
                    </p>

                    {/* Mensaje */}
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark truncate">
                      {n.message}
                    </p>
                  </div>

                  {!n.read && <span className="w-2 h-2 bg-red-500 rounded-full ml-2 shrink-0" />}
                </div>
              );
            })
          )}
        </div>

      </div>


      {/* Panel derecho: contenido */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedNotification ? (
          <NotificationContent notification={selectedNotification} />
        ) : (
          <div className="text-gray-400 text-center mt-20">Selecciona una notificación</div>
        )}
      </div>
    </div>
  );
}

// --- Renderizado según tipo de notificación ---
function NotificationContent({ notification }: { notification: AnyNotification }) {
  switch (notification.type) {
    case NotificationType.PRODUCT_ACCEPTED:
      return <ProductAcceptedView notification={notification} />;
    case NotificationType.PRODUCT_REJECTED:
      return <ProductRejectedView notification={notification} />;
    case NotificationType.INTEREST_MARKED:
      return <InterestMarkedView notification={notification} />;
    case NotificationType.INTEREST_ACCEPTED:
      return <InterestAcceptedView notification={notification} />;
    case NotificationType.INTEREST_REJECTED:
      return <InterestRejectedView notification={notification} />;
    case NotificationType.INTEREST_CANCELLED:
      return <InterestCancelledView notification={notification} />;
    case NotificationType.SELLER_CANCELLED_TRANSACTION:
      return <SellerCancelledTransactionView notification={notification} />;
    case NotificationType.BUYER_CANCELLED_TRANSACTION:
      return <BuyerCancelledTransactionView notification={notification} />;
    case NotificationType.DELIVERY_MARKED:
      return <DeliveryMarkedView notification={notification} />;
    case NotificationType.COMPLETION_CONFIRMED_BUYER:
      return <CompletionConfirmedBuyerView notification={notification} />;
    case NotificationType.COMPLETION_CONFIRMED_SELLER:
      return <CompletionConfirmedSellerView notification={notification} />;
    case NotificationType.SOLD_OUT_TOTAL:
      return <SoldOutTotalView notification={notification} />;
    case NotificationType.SOLD_OUT_PARTIAL:
      return <SoldOutPartialView notification={notification} />;
    case NotificationType.NOTIFY_AVAILABLE_ANY:
      return <NotifyAvailableAnyView notification={notification} />;
    case NotificationType.NOTIFY_AVAILABLE_FULL:
      return <NotifyAvailableFullView notification={notification} />;
    case NotificationType.BUYER_WAIT_ANY:
      return <BuyerWaitAnyView notification={notification} />;
    case NotificationType.BUYER_WAIT_FULL:
      return <BuyerWaitFullView notification={notification} />;
    default:
      return <div>Tipo de notificación no soportado</div>;
  }
}
