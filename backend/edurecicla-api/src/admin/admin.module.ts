import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminAction } from '../entities/admin-action.entity';
import { Product } from '../entities/product.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdminAction, Product])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
