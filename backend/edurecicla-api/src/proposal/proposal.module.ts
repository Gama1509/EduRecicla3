import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalController } from './proposal.controller';
import { ProposalService } from './proposal.service';
import { Proposal } from './proposal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proposal])],
  controllers: [ProposalController],
  providers: [ProposalService],
})
export class ProposalModule {}
