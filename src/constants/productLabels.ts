import { TransactionStatus, TransactionType } from "@/types/dashboard-transactions.dto";
import { NotificationType } from "@/types/notifications/notification-type.enum";
import { ProductCondition, ProductStatus, ProductType } from "@/types/product-details.dto";

// Mapas de traducción de enums
export const productTypeLabels: Record<ProductType, string> = {
  [ProductType.SALE]: 'Venta',
  [ProductType.DONATION]: 'Donación',
};

export const productConditionLabels: Record<ProductCondition, string> = {
  [ProductCondition.NEW]: 'Nuevo',
  [ProductCondition.USED]: 'Usado',
  [ProductCondition.REFURBISHED]: 'Reacondicionado',
};

export const productStatusLabels: Record<ProductStatus, string> = {
  [ProductStatus.PENDING]: 'Pendiente',
  [ProductStatus.APPROVED]: 'Aprobado',
  [ProductStatus.REJECTED]: 'Rechazado',
};
// Traducciones visuales para TransactionStatus
export const statusLabels: Record<TransactionStatus, string> = {
  [TransactionStatus.INTERESTED]: 'Interesado',
  [TransactionStatus.INTEREST_CANCELLED]: 'Interés cancelado',
  [TransactionStatus.IN_PROGRESS]: 'En progreso',
  [TransactionStatus.SELLER_CANCELLED_IN_PROGRESS]: 'Cancelado por vendedor (cuando estaba en progreso)',
  [TransactionStatus.BUYER_CANCELLED_IN_PROGRESS]: 'Cancelado por comprador (cuando estaba en progreso)',
  [TransactionStatus.REJECTED]: 'Rechazado',
  [TransactionStatus.SOLD_OUT_TOTAL]: 'Agotado total',
  [TransactionStatus.SOLD_OUT_PARTIAL]: 'Agotado parcial',
  [TransactionStatus.BUYER_CANCELLED_SOLD_OUT_TOTAL]: 'Cancelado por agotamiento total',
  [TransactionStatus.BUYER_CANCELLED_SOLD_OUT_PARTIAL]: 'Cancelado por agotamiento parcial',
  [TransactionStatus.NOTIFY_AVAILABLE_ANY]: 'Esperando notificación (cualquier cantidad)',
  [TransactionStatus.NOTIFY_AVAILABLE_FULL]: 'Esperando notificación (cantidad completa)',
  [TransactionStatus.DELIVERED]: 'Entregado',
  [TransactionStatus.COMPLETED]: 'Completado',
};

export const typeLabels: Record<TransactionType, string> = {
  [TransactionType.SALE]: 'Venta',
  [TransactionType.DONATION]: 'Donación',
};

export const notificationTypeLabels: Record<NotificationType, string> = {
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
