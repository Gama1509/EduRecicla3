import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateProductDto } from '../../product/dto/update-product.dto';
import { UpdatePCSpecsDto } from './update-pc-specs.dto';

export class UpdatePCDto extends UpdateProductDto {
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePCSpecsDto)
  specs?: UpdatePCSpecsDto;
}
