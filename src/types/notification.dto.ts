import { NotificationType } from "./notifications/notification-type.enum";
import { ProductCategory, ProductCondition, ProductType } from "./product-details.dto";


// DTO del producto dentro de la notificación
export interface NotificationProductDto {
  id: string;
  name: string;
  brand: string;
  type: ProductType;
  condition: ProductCondition;
  price: number | null;
  availableQuantity: number;
  category: ProductCategory;
  model: string;
  processor: string;
}

// DTO de la notificación completa
export interface NotificationDto {
  id: string;
  message: string;
  read: boolean;
  createdAt: string; // mejor usar string para front (ISO date)
  type: NotificationType;
  seenAt?: string;
  product: NotificationProductDto; // puede ser opcional
}