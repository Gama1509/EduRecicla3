import { IsEnum, IsOptional, IsString, IsUUID, IsNumber } from 'class-validator';
import { ProductCategory, ProductCondition, ProductStatus, ProductType } from '../product.entity';
import { UpdateHardwareSpecsDto } from './update-hardware-specs.dto';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(ProductCategory)
  @IsOptional()
  category?: ProductCategory;

  @IsEnum(ProductCondition)
  @IsOptional()
  condition?: ProductCondition;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsEnum(ProductType)
  @IsOptional()
  type?: ProductType;

  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @IsUUID()
  @IsOptional()
  ownerId?: string;

  @IsOptional()
  hardwareSpecs?: UpdateHardwareSpecsDto;
}
