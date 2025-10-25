import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: string): Promise<Proposal> {
    const proposal = await this.proposalRepository.findOneBy({ id });
    if (!proposal) {
      throw new NotFoundException(`Proposal with ID "${id}" not found`);
    }
    return proposal;
  }

  create(createProposalDto: CreateProposalDto): Promise<Proposal> {
    const proposal = this.proposalRepository.create(createProposalDto);
    return this.proposalRepository.save(proposal);
  }

  async update(id: string, updateProposalDto: UpdateProposalDto): Promise<Proposal> {
    const proposal = await this.findOne(id);
    await this.proposalRepository.update(id, updateProposalDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const proposal = await this.findOne(id);
    await this.proposalRepository.delete(id);
  }
}
