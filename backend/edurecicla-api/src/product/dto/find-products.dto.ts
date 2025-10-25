import { IsEnum, IsOptional } from 'class-validator';
import { ProductCategory, ProductCondition, ProductStatus, ProductType } from '../product.entity';

export class FindProductsDto {
  @IsEnum(ProductType)
  @IsOptional()
  type?: ProductType;

  @IsEnum(ProductCategory)
  @IsOptional()
  category?: ProductCategory;

  @IsEnum(ProductCondition)
  @IsOptional()
  condition?: ProductCondition;

  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;
}
