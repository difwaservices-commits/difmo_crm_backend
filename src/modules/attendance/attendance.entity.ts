import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from '../employees/employee.entity';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Employee)
  @JoinColumn()
  employee: Employee;

  @Column()
  employeeId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time', nullable: true })
  checkInTime: string;

  @Column({ type: 'time', nullable: true })
  checkOutTime: string;

  @Column({ default: 'present' })
  status: string; // present, absent, late, half-day, leave

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
