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
  CompletionConfirmedView,
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

export default function NotificationsPage() {
  const router = useRouter();
  const params = useParams();
  const selectedId = params.id;

  const [notifications, setNotifications] = useState<AnyNotification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<AnyNotification | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<NotificationType | "">("");

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
    if (notifications.length === 0) return;
    const found = notifications.find(n => n.id == selectedId);
    if (found) {
      setSelectedNotification(found);
      markAsRead(found);
    }
  }, [selectedId, notifications]);

  const markAsRead = async (notification: AnyNotification) => {
    if (!notification.read) {
      try {
        await api.patch(`/notification/${notification.id}/read`);
        setNotifications(prev =>
          prev.map(n => (n.id === notification.id ? { ...n, read: true } : n))
        );
      } catch (error) {
        console.error("Error al marcar notificación como leída:", error);
      }
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
      const title = getNotificationTitle(n.type)?.toLowerCase() || "";
      const message = n.message?.toLowerCase() || "";
      const term = search.toLowerCase();

      const matchesSearch =
        title.includes(term) || message.includes(term);

      const matchesType = typeFilter ? n.type === typeFilter : true;

      return matchesSearch && matchesType;
    });
  }, [notifications, search, typeFilter]);

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("");
  };

  const typeOptions = Object.values(NotificationType);

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
      {/* Panel izquierdo: lista y filtros */}
      <div className="w-1/3 border-r border-gray-300 flex flex-col">
        {/* Search + Filtros */}
        <div className="p-4 flex flex-col gap-2">
          <div className="relative mb-4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Buscar por título o mensaje..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 p-2 rounded-lg border border-gray-400 dark:border-white bg-white dark:bg-white/10 text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-secondary transition"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as NotificationType)}
            className="flex-1 min-w-[140px] px-4 py-2 rounded bg-black/80 border border-white text-white mb-4"
          >
            <option value="">Todos los tipos</option>
            {typeOptions.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
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
              return (
                <div
                  key={n.id}
                  onClick={() => handleSelect(n)}
                  className={classNames(
                    "cursor-pointer p-4 border-b border-gray-200 flex items-center justify-between rounded-lg m-2 transition-all duration-300",
                    {
                      "bg-gray-100 dark:bg-white/10": n.id === selectedNotification?.id,
                      "bg-white dark:bg-white/5 hover:scale-105": n.id !== selectedNotification?.id,
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
                  <div>
                    <p className="font-medium text-text-primary-light dark:text-text-primary-dark">
                      {getNotificationTitle(n.type)}
                    </p>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark truncate">
                      {n.message}
                    </p>
                  </div>

                  {!n.read && <span className="w-2 h-2 bg-red-500 rounded-full" />}
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
    case NotificationType.COMPLETION_CONFIRMED:
      return <CompletionConfirmedView notification={notification} />;
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
