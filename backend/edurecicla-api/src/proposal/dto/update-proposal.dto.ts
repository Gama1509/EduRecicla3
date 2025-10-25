import { IsEnum, IsOptional } from 'class-validator';
import { ProposalStatus } from '../proposal.entity';

export class UpdateProposalDto {
  @IsEnum(ProposalStatus)
  @IsOptional()
  status?: ProposalStatus;
}
