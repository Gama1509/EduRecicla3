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
  quantity: number;
  imageUrls: string[];

  price?: number;
  motherboard?: string;
  graphicsCard?: string;
  usbPorts?: number|null;
  hdmiPorts?: number|null;
  audioPorts?: number|null;
  ethernetPort?: boolean;
  wifi?: boolean;
  bluetooth?: boolean;
  color?: string;
  weight?: string;
  dimensions?: string;
  notes?: string;
  laptopSpecs?: CreateLaptopSpecsDto;
  pcSpecs?: CreatePCSpecsDto;
}

// DTO para specs de laptop
export interface CreateLaptopSpecsDto {
  batteryHealth?: string;
  screenSize?: string;
  webcam?: boolean;
  keyboardType?: string;
}

// DTO para specs de PC
export interface CreatePCSpecsDto {
  caseType?: string;
  powerSupply?: string;
  cpuCooler?: string;
  fans?: number;
  monitorIncluded?: boolean;
  keyboardIncluded?: boolean;
  mouseIncluded?: boolean;
}

