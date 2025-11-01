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
