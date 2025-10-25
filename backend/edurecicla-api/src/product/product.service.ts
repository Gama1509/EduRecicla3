import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { FindProductsDto } from './dto/find-products.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(findProductsDto: FindProductsDto): Promise<Product[]> {
    const query = this.productRepository.createQueryBuilder('product');

    if (findProductsDto.type) {
      query.andWhere('product.type = :type', { type: findProductsDto.type });
    }

    if (findProductsDto.status) {
      query.andWhere('product.status = :status', { status: findProductsDto.status });
    }

    if (findProductsDto.category) {
      query.andWhere('product.category = :category', { category: findProductsDto.category });
    }

    // Add pagination
    if (findProductsDto.page && findProductsDto.limit) {
      query.skip((findProductsDto.page - 1) * findProductsDto.limit).take(findProductsDto.limit);
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['laptopSpecs', 'pcSpecs'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.delete(id);
  }

  // Create and update methods will be handled by the specialized controllers
}
