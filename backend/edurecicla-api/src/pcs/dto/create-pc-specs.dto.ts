import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StorageType } from '../../entities/laptop-specs.entity';

export class CreatePCSpecsDto {
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
  @IsOptional()
  graphicsCard?: string;

  @IsString()
  @IsOptional()
  caseType?: string;

  @IsString()
  @IsOptional()
  powerSupply?: string;

  @IsString()
  @IsOptional()
  cpuCooler?: string;

  @IsInt()
  @IsOptional()
  fans?: number;

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
  monitorIncluded?: boolean;

  @IsBoolean()
  @IsOptional()
  keyboardIncluded?: boolean;

  @IsBoolean()
  @IsOptional()
  mouseIncluded?: boolean;

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
