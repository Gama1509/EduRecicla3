import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { HardwareSpecs } from './hardware-specs.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductsDto } from './dto/find-products.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(HardwareSpecs)
    private readonly hardwareSpecsRepository: Repository<HardwareSpecs>,
  ) {}

  findAll(findProductsDto: FindProductsDto): Promise<Product[]> {
    const query = this.productRepository.createQueryBuilder('product');

    if (findProductsDto.type) {
      query.andWhere('product.type = :type', { type: findProductsDto.type });
    }

    if (findProductsDto.category) {
      query.andWhere('product.category = :category', { category: findProductsDto.category });
    }

    if (findProductsDto.condition) {
      query.andWhere('product.condition = :condition', { condition: findProductsDto.condition });
    }

    if (findProductsDto.status) {
      query.andWhere('product.status = :status', { status: findProductsDto.status });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id }, relations: ['hardwareSpecs'] });
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { hardwareSpecs, ...productData } = createProductDto;
    const product = this.productRepository.create(productData);

    if (hardwareSpecs) {
      const newHardwareSpecs = this.hardwareSpecsRepository.create(hardwareSpecs);
      await this.hardwareSpecsRepository.save(newHardwareSpecs);
      product.hardwareSpecs = newHardwareSpecs;
    }

    return this.productRepository.save(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    const { hardwareSpecs, ...productData } = updateProductDto;

    if (hardwareSpecs && product.hardwareSpecs) {
      await this.hardwareSpecsRepository.update(product.hardwareSpecs.id, hardwareSpecs);
    }

    await this.productRepository.update(id, productData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.delete(id);
  }
}
