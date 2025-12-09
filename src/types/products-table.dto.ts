import { ProductCategory, ProductCondition, ProductStatus, ProductType, RAMSize, StorageCapacity, StorageType } from "./product-details.dto";

export interface ProductsTableDto {
    id: string;
    name: string;
    brand: string;
    model: string;
    category: ProductCategory;
    type: ProductType;
    condition: ProductCondition;
    status: ProductStatus;
    price?: number;
    stock: number;
    reservedQuantity: number;
    availableQuantity: number;
    ram: RAMSize;
    storageType: StorageType;
    storageCapacity: StorageCapacity;
    owner: string;
    createdAt: string;
    operatingSystem: string;
    processor: string;
    graphicsCard?: string;
    updatedAt: string;
    rejectionReason?: string;
}

