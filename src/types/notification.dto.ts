import { ProductCategory, ProductCondition, ProductType } from "./product-details.dto";

// Tipos de notificación
export enum NotificationType {
    ProductAccepted = 'product_accepted',
    ProductRejected = 'product_rejected',
    InterestMarked = 'interest_marked',
    TransactionStarted = 'transaction_started',
    TransactionInProcess = 'transaction_in_process',
    TransactionCanceled = 'transaction_canceled',
    TransactionCompleted = 'transaction_completed',
}

// DTO del producto dentro de la notificación
export interface NotificationProductDto {
  id: string;
  name: string;
  brand: string;
  type: ProductType;
  condition: ProductCondition;
  price: number | null;
  quantity: number;
  category: ProductCategory;
  model: string;
  processor: string;
}

// DTO de la notificación completa
export interface NotificationDto {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string; // mejor usar string para front (ISO date)
  type: NotificationType;
  product: NotificationProductDto; // puede ser opcional
}