import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { LaptopsModule } from './laptops/laptops.module';
import { PCsModule } from './pcs/pcs.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AdminModule } from './admin/admin.module';
import { CompatibilityModule } from './compatibility/compatibility.module';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { LaptopSpecs } from './entities/laptop-specs.entity';
import { PCSpecs } from './entities/pc-specs.entity';
import { Transaction } from './entities/transaction.entity';
import { AdminAction } from './entities/admin-action.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Product, LaptopSpecs, PCSpecs, Transaction, AdminAction],
        synchronize: true, // TODO: disable in production
      }),
    }),
    AuthModule,
    UserModule,
    ProductModule,
    LaptopsModule,
    PCsModule,
    TransactionsModule,
    AdminModule,
    CompatibilityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
