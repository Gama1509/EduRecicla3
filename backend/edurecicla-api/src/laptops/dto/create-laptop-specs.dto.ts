import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StorageType } from '../../entities/laptop-specs.entity';

export class CreateLaptopSpecsDto {
  @IsString()
  @IsNotEmpty()
  processor: string;

  @IsString()
  @IsNotEmpty()
  ram: string;

  @IsEnum(StorageType)
  @IsNotEmpty()
  storageType: StorageType;

  @IsString()
  @IsNotEmpty()
  storageCapacity: string;

  @IsString()
  @IsNotEmpty()
  motherboard: string;

  @IsString()
  @IsNotEmpty()
  screenSize: string;

  @IsString()
  @IsNotEmpty()
  batteryHealth: string;

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
