import { NotificationType } from "./notifications/notification-type.enum";

export enum TransactionType {
  SALE = "Sale",
  DONATION = "Donation",
}

export enum TransactionStatus {
  INTERESTED = 'Interested',                 // Comprador mostró interés, esperando aceptación del vendedor
  INTEREST_CANCELLED = 'InterestCancelled',  // Comprador canceló interés antes de que el vendedor aceptara/rechazara
  IN_PROGRESS = 'InProgress',                // La transacción está en curso (vendedor y comprador en proceso)
  SELLER_CANCELLED_IN_PROGRESS = 'SellerCancelledInProgress', // Cancelación en curso por el vendedor → sanción
  BUYER_CANCELLED_IN_PROGRESS = 'BuyerCancelledInProgress',   // Cancelación en curso por el comprador → sanción

  REJECTED = 'Rejected',                     // Transacción rechazada por el vendedor
  SOLD_OUT_TOTAL = 'SoldOutTotal',           // No se puede completar por agotamiento total del producto
  SOLD_OUT_PARTIAL = 'SoldOutPartial',       // La cantidad solicitada no se puede completar completamente, queda stock parcial
  BUYER_CANCELLED_SOLD_OUT_TOTAL = 'BuyerCancelledSoldOutTotal',   // Cancelación por agotamiento → sin sanción
  BUYER_CANCELLED_SOLD_OUT_PARTIAL = 'BuyerCancelledSoldOutPartial', // Cancelación por stock parcial → sin sanción

  NOTIFY_AVAILABLE_ANY = 'NotifyAvailableAny',   // Comprador decidió esperar a ser notificado cuando haya cualquier cantidad disponible
  NOTIFY_AVAILABLE_FULL = 'NotifyAvailableFull', // Comprador decidió esperar a ser notificado cuando haya la cantidad completa que necesita o más

  DELIVERED = 'Delivered',                   // Producto entregado por el vendedor
  COMPLETED = 'Completed',                   // Entrega confirmada por comprador
}


// DTO para usar en el front
export interface DashboardTransactionsDto {
  id: string;
  type: TransactionType;
  seller: string;   // nombre del vendedor
  buyer: string;    // nombre del comprador
  product: string;
  quantityRequested: number;
  requestReason?: string;
  status: TransactionStatus;
  totalPrice: number;
  cancelReason?: string;
  rejectedReason?: string;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
  last_notification_type_for_seller: NotificationType
  last_notification_type_for_buyer: NotificationType
  last_notification_type_for_transaction: NotificationType
}