import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HardwareSpecs } from './hardware-specs.entity';
import { CreateHardwareSpecsDto } from './dto/create-hardware-specs.dto';
import { UpdateHardwareSpecsDto } from './dto/update-hardware-specs.dto';

@Injectable()
export class HardwareSpecsService {
  constructor(
    @InjectRepository(HardwareSpecs)
    private readonly hardwareSpecsRepository: Repository<HardwareSpecs>,
  ) {}

  findAll(): Promise<HardwareSpecs[]> {
    return this.hardwareSpecsRepository.find();
  }

  findOne(id: string): Promise<HardwareSpecs> {
    return this.hardwareSpecsRepository.findOneBy({ id });
  }

  create(createHardwareSpecsDto: CreateHardwareSpecsDto): Promise<HardwareSpecs> {
    const hardwareSpecs = this.hardwareSpecsRepository.create(createHardwareSpecsDto);
    return this.hardwareSpecsRepository.save(hardwareSpecs);
  }

  async update(id: string, updateHardwareSpecsDto: UpdateHardwareSpecsDto): Promise<HardwareSpecs> {
    await this.hardwareSpecsRepository.update(id, updateHardwareSpecsDto);
    return this.hardwareSpecsRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.hardwareSpecsRepository.delete(id);
  }
}
