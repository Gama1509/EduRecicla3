import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class RejectProductDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsOptional()
  reason?: string;
}
