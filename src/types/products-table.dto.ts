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
    price: number;
    quantity: number;
    ram: RAMSize;
    storageType: StorageType;
    storageCapacity: StorageCapacity;
    owner: string;
    createdAt: string;
}

