import { IsEnum, IsOptional, IsInt, Min } from 'class-validator';
import { ProductType, ProductStatus, ProductCategory } from '../../entities/product.entity';

export class FindProductsDto {
  @IsEnum(ProductType)
  @IsOptional()
  type?: ProductType;

  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @IsEnum(ProductCategory)
  @IsOptional()
  category?: ProductCategory;

  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number;
}
