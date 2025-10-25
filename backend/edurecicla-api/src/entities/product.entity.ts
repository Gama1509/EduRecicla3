import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { LaptopSpecs } from './laptop-specs.entity';
import { PCSpecs } from './pc-specs.entity';
import { Transaction } from './transaction.entity';
import { AdminAction } from './admin-action.entity';

export enum ProductType {
  SALE = 'Sale',
  DONATION = 'Donation',
}

export enum ProductCondition {
  NEW = 'New',
  USED = 'Used',
  REFURBISHED = 'Refurbished',
}

export enum ProductStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export enum ProductCategory {
  LAPTOP = 'Laptop',
  PC = 'PC',
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ProductType })
  type: ProductType;

  @Column({ type: 'enum', enum: ProductCondition })
  condition: ProductCondition;

  @Column({ type: 'decimal', nullable: true })
  price: number;

  @Column()
  description: string;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.PENDING })
  status: ProductStatus;

  @Column({ type: 'enum', enum: ProductCategory })
  category: ProductCategory;

  @ManyToOne(() => User, user => user.products)
  owner: User;

  @Column({ name: 'owner_id' })
  ownerId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => LaptopSpecs, laptopSpecs => laptopSpecs.product, { cascade: true })
  laptopSpecs: LaptopSpecs;

  @OneToOne(() => PCSpecs, pcSpecs => pcSpecs.product, { cascade: true })
  pcSpecs: PCSpecs;

  @OneToMany(() => Transaction, transaction => transaction.product)
  transactions: Transaction[];

  @OneToMany(() => AdminAction, adminAction => adminAction.product)
  adminActions: AdminAction[];
}
