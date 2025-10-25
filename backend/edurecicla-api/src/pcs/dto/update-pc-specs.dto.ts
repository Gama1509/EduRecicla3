import { IsBoolean, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { StorageType } from '../../entities/laptop-specs.entity';

export class UpdatePCSpecsDto {
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
