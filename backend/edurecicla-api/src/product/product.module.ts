import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { HardwareSpecs } from './hardware-specs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, HardwareSpecs])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
