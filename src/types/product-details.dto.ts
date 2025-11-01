export type LaptopSpecs = {
    batteryHealth?: string;
    screenSize?: string;
    webcam?: boolean;
    keyboardType?: string;
};

export type PCSpecs = {
    caseType?: string;
    powerSupply?: string;
    cpuCooler?: string;
    fans?: number;
    monitorIncluded?: boolean;
    keyboardIncluded?: boolean;
    mouseIncluded?: boolean;
};


export type Product = {
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
    storageType: StorageType;
    storageCapacity: StorageCapacity;
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
    createdAt: Date;
    updatedAt: Date;
    imageUrls: string[];

    // Especificaciones dependientes del tipo
    laptopSpecs?: LaptopSpecs;
    pcSpecs?: PCSpecs;
};

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



