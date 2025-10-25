import { IsEnum, IsOptional } from 'class-validator';
import { TransactionStatus } from '../../entities/transaction.entity';

export class UpdateTransactionDto {
  @IsEnum(TransactionStatus)
  @IsOptional()
  status?: TransactionStatus;
}
