// enums
export enum ProductType {
  SALE = 'Sale',
  DONATION = 'Donation',
}

export enum ProductCondition {
  NEW = 'New',
  USED = 'Used',
  REFURBISHED = 'Refurbished',
}

export enum ProductStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export enum ProductCategory {
  LAPTOP = 'Laptop',
  PC = 'PC',
}

export enum StorageType {
  SSD = 'SSD',
  HDD = 'HDD',
}

export enum RAMSize {
  GB4 = "4GB",
  GB8 = "8GB",
  GB16 = "16GB",
  GB32 = "32GB",
  GB64 = "64GB",
}

export enum StorageCapacity {
  GB128 = "128GB",
  GB256 = "256GB",
  GB512 = "512GB",
  TB1 = "1TB",
  TB2 = "2TB",
}

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

