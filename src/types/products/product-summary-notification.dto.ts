import { ProductCategory, ProductCondition, ProductStatus, ProductType } from "../product-details.dto";

export interface ProductSummaryForNotification {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  condition: ProductCondition;
  status: ProductStatus;
  type: ProductType;
  price?: number;
  availableQuantity: number;
  stock: number;
  reservedQuantity: number;
  ownerName: string;
  imageUrls: string[];
}