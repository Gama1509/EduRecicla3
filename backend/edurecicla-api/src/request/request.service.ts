import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from './request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
  ) {}

  findAll(): Promise<Request[]> {
    return this.requestRepository.find();
  }

  findOne(id: string): Promise<Request> {
    return this.requestRepository.findOneBy({ id });
  }

  create(createRequestDto: CreateRequestDto): Promise<Request> {
    const request = this.requestRepository.create(createRequestDto);
    return this.requestRepository.save(request);
  }

  async update(id: string, updateRequestDto: UpdateRequestDto): Promise<Request> {
    await this.requestRepository.update(id, updateRequestDto);
    return this.requestRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.requestRepository.delete(id);
  }
}
