import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateProductDto } from '../../product/dto/update-product.dto';
import { UpdateLaptopSpecsDto } from './update-laptop-specs.dto';

export class UpdateLaptopDto extends UpdateProductDto {
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateLaptopSpecsDto)
  specs?: UpdateLaptopSpecsDto;
}
