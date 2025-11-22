import { ProductCategory, ProductCondition, ProductStatus, ProductType } from "./product-details.dto";

export interface DashboardProductsDto {
  name: string;
  brand: string;
  category: ProductCategory;
  type: ProductType;
  condition: ProductCondition;
  status: ProductStatus;
  price: number;
  stock: number;
  reservedQuantity: number;
  availableQuantity: number;
  owner: string;
  createdAt: string;
  operatingSystem: string
}
