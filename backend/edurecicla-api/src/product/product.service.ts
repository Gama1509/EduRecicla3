import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductsDto } from './dto/find-products.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
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

  findOne(id: string): Promise<Product> {
    return this.productRepository.findOneBy({ id });
  }

  create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    return this.productRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }
}
