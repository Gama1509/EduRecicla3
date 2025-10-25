import { IsBoolean, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { StorageType } from '../../entities/laptop-specs.entity';

export class UpdateLaptopSpecsDto {
  @IsString()
  @IsOptional()
  processor?: string;

  @IsString()
  @IsOptional()
  ram?: string;

  @IsEnum(StorageType)
  @IsOptional()
  storageType?: StorageType;

  @IsString()
  @IsOptional()
  storageCapacity?: string;

  @IsString()
  @IsOptional()
  motherboard?: string;

  @IsString()
  @IsOptional()
  screenSize?: string;

  @IsString()
  @IsOptional()
  batteryHealth?: string;

  @IsString()
  @IsOptional()
  graphicsCard?: string;

  @IsString()
  @IsOptional()
  operatingSystem?: string;

  @IsInt()
  @IsOptional()
  usbPorts?: number;

  @IsInt()
  @IsOptional()
  hdmiPorts?: number;

  @IsInt()
  @IsOptional()
  audioPorts?: number;

  @IsBoolean()
  @IsOptional()
  ethernetPort?: boolean;

  @IsBoolean()
  @IsOptional()
  wifi?: boolean;

  @IsBoolean()
  @IsOptional()
  bluetooth?: boolean;

  @IsBoolean()
  @IsOptional()
  webcam?: boolean;

  @IsString()
  @IsOptional()
  keyboardType?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  weight?: string;

  @IsString()
  @IsOptional()
  dimensions?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
