import { IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProductDto } from '../../product/dto/create-product.dto';
import { CreatePCSpecsDto } from './create-pc-specs.dto';

export class CreatePCDto extends CreateProductDto {
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreatePCSpecsDto)
  specs: CreatePCSpecsDto;
}
