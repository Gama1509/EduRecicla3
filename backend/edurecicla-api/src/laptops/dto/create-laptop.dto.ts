import { IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProductDto } from '../../product/dto/create-product.dto';
import { CreateLaptopSpecsDto } from './create-laptop-specs.dto';

export class CreateLaptopDto extends CreateProductDto {
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateLaptopSpecsDto)
  specs: CreateLaptopSpecsDto;
}
