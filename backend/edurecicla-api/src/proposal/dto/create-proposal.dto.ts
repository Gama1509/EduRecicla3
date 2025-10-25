import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ProposalType } from '../proposal.entity';

export class CreateProposalDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsEnum(ProposalType)
  @IsNotEmpty()
  type: ProposalType;
}
