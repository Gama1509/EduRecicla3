import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductCategory } from '../entities/product.entity';
import { LaptopSpecs } from '../entities/laptop-specs.entity';
import { CreateLaptopDto } from './dto/create-laptop.dto';
import { UpdateLaptopDto } from './dto/update-laptop.dto';

@Injectable()
export class LaptopsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(LaptopSpecs)
    private readonly laptopSpecsRepository: Repository<LaptopSpecs>,
  ) {}

  async create(createLaptopDto: CreateLaptopDto): Promise<Product> {
    const { specs, ...productData } = createLaptopDto;
    const product = this.productRepository.create({
      ...productData,
      category: ProductCategory.LAPTOP,
    });
    const newProduct = await this.productRepository.save(product);

    const laptopSpecs = this.laptopSpecsRepository.create({
      ...specs,
      productId: newProduct.id,
    });
    await this.laptopSpecsRepository.save(laptopSpecs);

    return newProduct;
  }

  async update(id: string, updateLaptopDto: UpdateLaptopDto): Promise<Product> {
    const { specs, ...productData } = updateLaptopDto;
    const product = await this.productRepository.findOneBy({ id });
    await this.productRepository.update(id, productData);

    if (specs) {
      const laptopSpecs = await this.laptopSpecsRepository.findOneBy({ productId: id });
      await this.laptopSpecsRepository.update(laptopSpecs.id, specs);
    }

    return this.productRepository.findOne({
      where: { id },
      relations: ['laptopSpecs'],
    });
  }
}
