import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Company } from '../../companies/company.entity';
import { Client } from './client.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ default: 'active' })
  status: string; // active, completed, on-hold, cancelled

  @Column({ nullable: true })
  budget: number;

  @ManyToOne(() => Company)
  company: Company;

  @Column()
  companyId: string;

  @ManyToOne(() => Client, { nullable: true })
  client: Client;

  @Column({ nullable: true })
  clientId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
