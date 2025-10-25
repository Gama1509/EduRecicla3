import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import { StorageType } from './laptop-specs.entity';

@Entity()
export class PCSpecs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Product, product => product.pcSpecs)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_id' })
  productId: string;

  @Column()
  processor: string;

  @Column()
  ram: string;

  @Column({ type: 'enum', enum: StorageType })
  storageType: StorageType;

  @Column({ name: 'storage_capacity' })
  storageCapacity: string;

  @Column()
  motherboard: string;

  @Column({ name: 'graphics_card', default: 'Unknown' })
  graphicsCard: string;

  @Column({ name: 'case_type', default: 'Unknown' })
  caseType: string;

  @Column({ name: 'power_supply', default: 'Unknown' })
  powerSupply: string;

  @Column({ name: 'cpu_cooler', default: 'Unknown' })
  cpuCooler: string;

  @Column({ type: 'integer', nullable: true })
  fans: number;

  @Column({ name: 'usb_ports', type: 'integer', nullable: true })
  usbPorts: number;

  @Column({ name: 'hdmi_ports', type: 'integer', nullable: true })
  hdmiPorts: number;

  @Column({ name: 'audio_ports', type: 'integer', nullable: true })
  audioPorts: number;

  @Column({ name: 'ethernet_port', nullable: true })
  ethernetPort: boolean;

  @Column({ nullable: true })
  wifi: boolean;

  @Column({ nullable: true })
  bluetooth: boolean;

  @Column({ name: 'monitor_included', nullable: true })
  monitorIncluded: boolean;

  @Column({ name: 'keyboard_included', nullable: true })
  keyboardIncluded: boolean;

  @Column({ name: 'mouse_included', nullable: true })
  mouseIncluded: boolean;

  @Column({ default: 'Unknown' })
  color: string;

  @Column({ default: 'Unknown' })
  weight: string;

  @Column({ default: 'Unknown' })
  dimensions: string;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
