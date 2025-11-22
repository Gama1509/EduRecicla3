import { ProductCategory, ProductCondition, RAMSize, StorageCapacity, StorageType } from "@/types/product-details.dto";

// DTO principal para crear producto
export interface CreateProductDto {
  name: string;
  brand: string;
  condition: ProductCondition;
  description: string;
  category: ProductCategory;
  model: string;
  processor: string;
  ram: RAMSize;
  storageType: StorageType;
  storageCapacity: StorageCapacity;
  stock: number;
  imageUrls: string[];
  operatingSystem: string;

  price?: number | null;
  motherboard?: string | null;
  graphicsCard?: string | null;
  usbPorts: number;
  hdmiPorts: number;
  audioPorts: number;
  ethernetPort: boolean;
  wifi: boolean;
  bluetooth: boolean;
  color?: string | null;
  weight?: string | null;
  dimensions?: string | null;
  notes?: string | null;

  laptopSpecs?: CreateLaptopSpecsDto;
  pcSpecs?: CreatePCSpecsDto;
}

// DTO para specs de laptop
export interface CreateLaptopSpecsDto {
  batteryHealth?: string;
  screenSize?: string;
  webcam: boolean;
  keyboardType?: string;
}

// DTO para specs de PC
export interface CreatePCSpecsDto {
  caseType?: string;
  powerSupply?: string;
  cpuCooler?: string;
  fans?: number;
  monitorIncluded: boolean;
  keyboardIncluded: boolean;
  mouseIncluded: boolean;
}

