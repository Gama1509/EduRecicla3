import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class HardwareSpecs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ram: string;

  @Column()
  motherboard: string;

  @Column()
  processor: string;

  @Column()
  storage: string;

  @Column({ name: 'graphics_card', nullable: true })
  graphicsCard: string;
}
