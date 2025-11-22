import { LaptopSpecsDto, PCSpecsDto, ProductCategory, ProductCondition, ProductStatus, ProductType } from "./product-details.dto";

export enum ProductUserState {
  NotLoggedIn = 'NotLoggedIn',             // Usuario no logueado
  Owner = 'Owner',                         // Usuario es dueño del producto
  MostrarInteres = 'MostrarInteres',       // Puede mostrar interés (incluye Completed y BuyerCancelledSoldOut*)
  Pending = 'Pending',                     // Interés enviado, espera de aprobación
  InProgress = 'InProgress',               // Transacción en curso
  Cancelled = 'Cancelled',                 // Cancelado con sanción temporal
  SoldOutTotal = 'SoldOutTotal',           // Sin stock total
  SoldOutPartial = 'SoldOutPartial',       // Stock parcial
  NotifyAvailableAny = 'NotifyAvailableAny',   // Espera notificación cualquier cantidad
  NotifyAvailableFull = 'NotifyAvailableFull', // Espera notificación cantidad completa
  Delivered = 'Delivered',                 // Producto entregado por vendedor
}


export interface ProductDetailsWithStateDto {
  id: string;
  ownerId: string;
  owner_name: string;
  name: string;
  brand: string;
  type: ProductType;
  condition: ProductCondition;
  price: number | null;
  description: string;
  availableQuantity: number;
  status: ProductStatus;
  category: ProductCategory;
  model: string;
  processor: string;
  ram: string;
  storageType: string;
  storageCapacity: string;
  motherboard?: string;
  graphicsCard?: string;
  usbPorts: number;
  hdmiPorts: number;
  audioPorts: number;
  ethernetPort: boolean;
  wifi: boolean;
  bluetooth: boolean;
  color?: string;
  weight?: string;
  dimensions?: string;
  notes?: string;
  createdAt: string; // en front se recomienda usar string para fechas
  updatedAt: string;
  imageUrls: string[];
  operatingSystem: string;
  laptopSpecs?: LaptopSpecsDto;
  pcSpecs?: PCSpecsDto;
  userState: ProductUserState;
  daysLeft?: number;
  transactionId?: string;
}