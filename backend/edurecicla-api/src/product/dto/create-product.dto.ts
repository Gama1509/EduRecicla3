import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ProductCategory, ProductCondition, ProductType } from '../product.entity';
import { CreateHardwareSpecsDto } from './create-hardware-specs.dto';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ProductCategory)
  @IsNotEmpty()
  category: ProductCategory;

  @IsEnum(ProductCondition)
  @IsNotEmpty()
  condition: ProductCondition;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsEnum(ProductType)
  @IsNotEmpty()
  type: ProductType;

  @IsUUID()
  @IsNotEmpty()
  ownerId: string;

  @IsOptional()
  hardwareSpecs?: CreateHardwareSpecsDto;
}
