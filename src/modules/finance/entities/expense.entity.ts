import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Company } from '../../companies/company.entity';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  category: string; // rent, utility, equipment, marketing, etc

  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => Company)
  company: Company;

  @Column()
  companyId: string;

  @Column({ default: 'paid' })
  status: string; // pending, paid

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
