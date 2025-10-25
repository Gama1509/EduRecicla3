import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proposal } from './proposal.entity';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';

@Injectable()
export class ProposalService {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepository: Repository<Proposal>,
  ) {}

  findAll(): Promise<Proposal[]> {
    return this.proposalRepository.find();
  }

  findOne(id: string): Promise<Proposal> {
    return this.proposalRepository.findOneBy({ id });
  }

  create(createProposalDto: CreateProposalDto): Promise<Proposal> {
    const proposal = this.proposalRepository.create(createProposalDto);
    return this.proposalRepository.save(proposal);
  }

  async update(id: string, updateProposalDto: UpdateProposalDto): Promise<Proposal> {
    await this.proposalRepository.update(id, updateProposalDto);
    return this.proposalRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.proposalRepository.delete(id);
  }
}
