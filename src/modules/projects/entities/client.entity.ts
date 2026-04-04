import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Company } from '../../companies/company.entity';
import { Employee } from 'src/modules/employees/employee.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  // Project.entity.ts mein dekho
@ManyToMany(() => Employee)
@JoinTable()
assignedEmployees: Employee[];

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  address: string;

  @ManyToOne(() => Company)
  company: Company;

  @Column()
  companyId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
