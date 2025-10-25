import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductCategory } from '../entities/product.entity';
import { PCSpecs } from '../entities/pc-specs.entity';
import { CreatePCDto } from './dto/create-pc.dto';
import { UpdatePCDto } from './dto/update-pc.dto';

@Injectable()
export class PCsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(PCSpecs)
    private readonly pcSpecsRepository: Repository<PCSpecs>,
  ) {}

  async create(createPCDto: CreatePCDto): Promise<Product> {
    const { specs, ...productData } = createPCDto;
    const product = this.productRepository.create({
      ...productData,
      category: ProductCategory.PC,
    });
    const newProduct = await this.productRepository.save(product);

    const pcSpecs = this.pcSpecsRepository.create({
      ...specs,
      productId: newProduct.id,
    });
    await this.pcSpecsRepository.save(pcSpecs);

    return newProduct;
  }

  async update(id: string, updatePCDto: UpdatePCDto): Promise<Product> {
    const { specs, ...productData } = updatePCDto;
    const product = await this.productRepository.findOneBy({ id });
    await this.productRepository.update(id, productData);

    if (specs) {
      const pcSpecs = await this.pcSpecsRepository.findOneBy({ productId: id });
      await this.pcSpecsRepository.update(pcSpecs.id, specs);
    }

    return this.productRepository.findOne({
      where: { id },
      relations: ['pcSpecs'],
    });
  }
}
