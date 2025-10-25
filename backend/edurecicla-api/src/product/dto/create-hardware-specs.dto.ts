import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHardwareSpecsDto {
  @IsString()
  @IsNotEmpty()
  ram: string;

  @IsString()
  @IsNotEmpty()
  motherboard: string;

  @IsString()
  @IsNotEmpty()
  processor: string;

  @IsString()
  @IsNotEmpty()
  storage: string;

  @IsString()
  @IsOptional()
  graphicsCard?: string;
}
