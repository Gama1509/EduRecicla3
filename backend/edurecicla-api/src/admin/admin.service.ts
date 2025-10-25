import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminAction, AdminActionType } from '../entities/admin-action.entity';
import { Product, ProductStatus } from '../entities/product.entity';
import { ApproveProductDto } from './dto/approve-product.dto';
import { RejectProductDto } from './dto/reject-product.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminAction)
    private readonly adminActionRepository: Repository<AdminAction>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async approve(approveProductDto: ApproveProductDto, adminId: string): Promise<AdminAction> {
    const { productId } = approveProductDto;
    await this.productRepository.update(productId, { status: ProductStatus.APPROVED });

    const adminAction = this.adminActionRepository.create({
      productId,
      adminId,
      action: AdminActionType.APPROVED,
    });

    return this.adminActionRepository.save(adminAction);
  }

  async reject(rejectProductDto: RejectProductDto, adminId: string): Promise<AdminAction> {
    const { productId, reason } = rejectProductDto;
    await this.productRepository.update(productId, { status: ProductStatus.REJECTED });

    const adminAction = this.adminActionRepository.create({
      productId,
      adminId,
      action: AdminActionType.REJECTED,
      reason,
    });

    return this.adminActionRepository.save(adminAction);
  }
}
