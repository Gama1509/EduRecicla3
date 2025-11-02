import { LaptopSpecsDto, PCSpecsDto, ProductCategory, ProductCondition, ProductStatus, ProductType } from "./product-details.dto";

export enum ProductUserState {
  MostrarInteres = 'MostrarInteres', // puede mostrar interés
  Pending = 'Pending',               // ya envió solicitud, esperando respuesta
  InProgress = 'InProgress',         // transacción en proceso
  Cancelled = 'Cancelled',           // cancelado/rechazado, esperar 15 días
}
export interface ProductDetailsWithStateDto {
  id: string;
  owner_name: string;
  name: string;
  brand: string;
  type: ProductType;
  condition: ProductCondition;
  price: number | null;
  description: string;
  quantity: number;
  status: ProductStatus;
  category: ProductCategory;
  model: string;
  processor: string;
  ram: string;
  storageType: string;
  storageCapacity: string;
  motherboard?: string;
  graphicsCard?: string;
  usbPorts?: number;
  hdmiPorts?: number;
  audioPorts?: number;
  ethernetPort?: boolean;
  wifi?: boolean;
  bluetooth?: boolean;
  color?: string;
  weight?: string;
  dimensions?: string;
  notes?: string;
  createdAt: string; // en front se recomienda usar string para fechas
  updatedAt: string;
  imageUrls: string[];
  laptopSpecs?: LaptopSpecsDto;
  pcSpecs?: PCSpecsDto;
  userState: ProductUserState;
  daysLeft?: number;
}