import { IsNotEmpty, IsUUID } from 'class-validator';

export class ApproveProductDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;
}
