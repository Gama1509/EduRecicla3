import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

export enum StorageType {
  SSD = 'SSD',
  HDD = 'HDD',
  HYBRID = 'Hybrid',
}

@Entity()
export class LaptopSpecs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Product, product => product.laptopSpecs)
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

  @Column({ name: 'screen_size' })
  screenSize: string;

  @Column({ name: 'battery_health' })
  batteryHealth: string;

  @Column({ name: 'graphics_card', default: 'Unknown' })
  graphicsCard: string;

  @Column({ name: 'operating_system', default: 'Unknown' })
  operatingSystem: string;

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

  @Column({ nullable: true })
  webcam: boolean;

  @Column({ name: 'keyboard_type', default: 'Unknown' })
  keyboardType: string;

  @Column({ default: 'Unknown' })
  color: string;

  @Column({ default: 'Unknown' })
  weight: string;

  @Column({ default: 'Unknown' })
  dimensions: string;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
