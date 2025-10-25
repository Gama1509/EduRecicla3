import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { HardwareSpecs } from './hardware-specs.entity';
import { HardwareSpecsController } from './hardware-specs.controller';
import { HardwareSpecsService } from './hardware-specs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, HardwareSpecs])],
  controllers: [ProductController, HardwareSpecsController],
  providers: [ProductService, HardwareSpecsService],
})
export class ProductModule {}
