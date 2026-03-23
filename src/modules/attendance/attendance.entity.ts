import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Employee } from '../employees/employee.entity';
import { Payroll } from '../finance/entities/payroll.entity';
import { Company } from '../companies/company.entity';  // ✅ add this

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Employee)
  @JoinColumn()
  employee: Employee;

  @Column()
  employeeId: string;

  @OneToMany(() => Payroll, (payroll) => payroll.attendance)
  payrolls: Payroll[];

   @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' })
  company: Company;

   @Column()
   companyId:String;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time', nullable: true })
  checkInTime: string;

  @Column({ type: 'time', nullable: true })
  checkOutTime: string;

  @Column({
    type: 'enum',
    enum: ['present', 'absent', 'leave', 'half-day'],
    default: 'present'
  })
  status: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  workHours: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  overtime: number;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  location: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
