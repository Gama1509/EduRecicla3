import { ProductSummaryForNotification } from "../products/product-summary-notification.dto";
import { UserSummary } from "../users/user-summary.dto";
import { NotificationType } from "./notification-type.enum";

// Base de todas las notificaciones
export interface NotificationBase {
  id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: Date;
  seenAt?: Date;
  product: ProductSummaryForNotification;
  canViewProduct: boolean;
}


export interface ProductAcceptedNotification extends NotificationBase {
  type: NotificationType.PRODUCT_ACCEPTED; // Admin aceptó el producto → notificación al vendedor
  // No necesita más campos, el producto ya está en NotificationBase
}

export interface ProductRejectedNotification extends NotificationBase {
  type: NotificationType.PRODUCT_REJECTED; // Admin rechazó el producto → notificación al vendedor
  rejectionReason: string;                 // Razón del rechazo
  canEditProduct: boolean;
}

export interface InterestMarkedNotification extends NotificationBase {
  type: NotificationType.INTEREST_MARKED;
  buyerInfo: UserSummary;
  requestReason?: string;
  transactionId: string;
  canInteract: boolean;
  canGoToChat: boolean;
  chatId?: string;
}

export interface InterestAcceptedNotification extends NotificationBase {
  type: NotificationType.INTEREST_ACCEPTED;
  sellerInfo: UserSummary;
  chatId: string;
  transactionId: string;
  canGoToChat: boolean;
}

export interface InterestRejectedNotification extends NotificationBase {
  type: NotificationType.INTEREST_REJECTED;
  sellerInfo: UserSummary;
  transactionId: string;
  rejectionReason: string;
}

export interface InterestCancelledNotification extends NotificationBase {
  type: NotificationType.INTEREST_CANCELLED;
  buyerInfo: UserSummary;
  transactionId: string;
  cancellationReason: string;
}

export interface SellerCancelledTransactionNotification extends NotificationBase {
  type: NotificationType.SELLER_CANCELLED_TRANSACTION;
  sellerInfo: UserSummary;
  transactionId: string;
  cancellationReason: string;
}

export interface BuyerCancelledTransactionNotification extends NotificationBase {
  type: NotificationType.BUYER_CANCELLED_TRANSACTION;
  buyerInfo: UserSummary;
  transactionId: string;
  cancellationReason: string;
}

export interface DeliveryMarkedNotification extends NotificationBase {
  type: NotificationType.DELIVERY_MARKED;
  sellerInfo: UserSummary;
  transactionId: string;
  canInteract: boolean;
}

export interface CompletionConfirmedBuyerNotification extends NotificationBase {
  type: NotificationType.COMPLETION_CONFIRMED_BUYER;
  sellerInfo: UserSummary;
  transactionId: string;
}

// 🔹 Notificación para el vendedor
export interface CompletionConfirmedSellerNotification extends NotificationBase {
  type: NotificationType.COMPLETION_CONFIRMED_SELLER;
  buyerInfo: UserSummary;
  transactionId: string;
}


export interface SoldOutTotalNotification extends NotificationBase {
  type: NotificationType.SOLD_OUT_TOTAL;
  transactionId: string;
  canInteract: boolean;
}

export interface SoldOutPartialNotification extends NotificationBase {
  type: NotificationType.SOLD_OUT_PARTIAL;
  transactionId: string;
  canInteract: boolean;
}

export interface AvailableAnyNotification extends NotificationBase {
  type: NotificationType.NOTIFY_AVAILABLE_ANY;
  transactionId: string;
  sellerInfo: UserSummary;
  canInteract: boolean;
}

export interface AvailableFullNotification extends NotificationBase {
  type: NotificationType.NOTIFY_AVAILABLE_FULL;
  transactionId: string;
  sellerInfo: UserSummary;
  canInteract: boolean;
}

export interface BuyerWaitAnyNotification extends NotificationBase {
  type: NotificationType.BUYER_WAIT_ANY;
  buyerInfo: UserSummary;
  transactionId: string;
}

export interface BuyerWaitFullNotification extends NotificationBase {
  type: NotificationType.BUYER_WAIT_FULL;
  buyerInfo: UserSummary;
  transactionId: string;
}
