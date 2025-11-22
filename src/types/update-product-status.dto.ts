import { ProductStatus } from "./product-details.dto";

export interface UpdateProductStatusDto {
  productId: string;
  status: ProductStatus;
  reason?: string;
}
