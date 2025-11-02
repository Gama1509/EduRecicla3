import { ProductCategory, ProductCondition, ProductType, RAMSize, StorageCapacity, StorageType } from "./product-details.dto";

export interface ProductCardDto {
  id: string;
  name: string;
  brand: string;
  model: string;
  type: ProductType;
  condition: ProductCondition;
  price: number | null;
  quantity: number;
  category: ProductCategory;
  imageUrl: string;
  processor: string;
  ram: RAMSize;
  storageType: StorageType;
  storageCapacity: StorageCapacity;
  graphicsCard?: string;
  screenSize?: string;
  color?: string;
  createdAt: string; // ISO string para front
}
