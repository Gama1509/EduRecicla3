import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { PCSpecs } from '../entities/pc-specs.entity';
import { PCsController } from './pcs.controller';
import { PCsService } from './pcs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, PCSpecs])],
  controllers: [PCsController],
  providers: [PCsService],
})
export class PCsModule {}
