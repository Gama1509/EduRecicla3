import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: string): Promise<Request> {
    const request = await this.requestRepository.findOneBy({ id });
    if (!request) {
      throw new NotFoundException(`Request with ID "${id}" not found`);
    }
    return request;
  }

  create(createRequestDto: CreateRequestDto): Promise<Request> {
    const request = this.requestRepository.create(createRequestDto);
    return this.requestRepository.save(request);
  }

  async update(id: string, updateRequestDto: UpdateRequestDto): Promise<Request> {
    const request = await this.findOne(id);
    await this.requestRepository.update(id, updateRequestDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const request = await this.findOne(id);
    await this.requestRepository.delete(id);
  }
}
