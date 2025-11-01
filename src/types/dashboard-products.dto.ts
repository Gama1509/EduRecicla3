// src/types/dashboard-products.dto.ts

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

export interface DashboardProductsDto {
  name: string;
  brand: string;
  category: ProductCategory;
  type: ProductType;
  condition: ProductCondition;
  status: ProductStatus;
  price: number;
  quantity: number;
  owner: string;
  createdAt: string;
}
