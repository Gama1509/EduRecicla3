import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductStatus } from '../entities/product.entity';
import { Transaction, TransactionStatus, TransactionType } from '../entities/transaction.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class CompatibilityService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getProposals(): Promise<any[]> {
    const pendingProducts = await this.productRepository.find({
      where: { status: ProductStatus.PENDING },
      relations: ['owner'],
    });

    return pendingProducts.map(product => ({
      id: product.id,
      userName: product.owner.name,
      productName: product.name,
      type: product.type,
      status: product.status,
    }));
  }

  async getRequests(): Promise<any[]> {
    const pendingDonations = await this.transactionRepository.find({
      where: {
        type: TransactionType.DONATION,
        status: TransactionStatus.PENDING,
      },
      relations: ['product', 'buyer'],
    });

    return pendingDonations.map(transaction => ({
      id: transaction.id,
      userName: transaction.buyer.name,
      productName: transaction.product.name,
      status: transaction.status,
    }));
  }
}
