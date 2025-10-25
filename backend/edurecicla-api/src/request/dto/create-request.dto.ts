import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRequestDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  productId: string;
}
