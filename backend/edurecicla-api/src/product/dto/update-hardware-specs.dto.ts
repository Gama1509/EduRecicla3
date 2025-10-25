import { IsOptional, IsString } from 'class-validator';

export class UpdateHardwareSpecsDto {
  @IsString()
  @IsOptional()
  ram?: string;

  @IsString()
  @IsOptional()
  motherboard?: string;

  @IsString()
  @IsOptional()
  processor?: string;

  @IsString()
  @IsOptional()
  storage?: string;

  @IsString()
  @IsOptional()
  graphicsCard?: string;
}
