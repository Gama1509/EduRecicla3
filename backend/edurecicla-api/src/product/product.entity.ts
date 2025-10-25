import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { HardwareSpecs } from './hardware-specs.entity';
import { User } from '../user/user.entity';

export enum ProductCategory {
  LAPTOP = 'Laptop',
  PC = 'PC',
}

export enum ProductCondition {
  NEW = 'New',
  USED = 'Used',
  REFURBISHED = 'Refurbished',
}

export enum ProductType {
  SALE = 'Sale',
  DONATION = 'Donation',
}

export enum ProductStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ProductCategory,
  })
  category: ProductCategory;

  @Column({
    type: 'enum',
    enum: ProductCondition,
  })
  condition: ProductCondition;

  @Column({ type: 'decimal', nullable: true })
  price: number;

  @Column()
  description: string;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column({
    type: 'enum',
    enum: ProductType,
  })
  type: ProductType;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.PENDING,
  })
  status: ProductStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ name: 'owner_id' })
  ownerId: string;

  @OneToOne(() => HardwareSpecs, { cascade: true })
  @JoinColumn({ name: 'hardware_specs_id' })
  hardwareSpecs: HardwareSpecs;
}
