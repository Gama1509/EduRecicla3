import { ProductCategory, ProductCondition, ProductStatus, ProductType } from "./product-details.dto";

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
