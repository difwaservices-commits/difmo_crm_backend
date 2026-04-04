import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Employee } from '../employees/employee.entity';

@Entity('add-projects')
export class AllProject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  projectName: string;

  @Column({ nullable: true })
  githubLink: string;

  // Project.entity.ts mein dekho
@ManyToMany(() => Employee)
@JoinTable()
assignedEmployees: Employee[];

  @Column()
  clientName: string;

  @Column()
  contactInfo: string;

  @Column({ nullable: true })
  clientEmail:string;

  @Column({ type: 'date', nullable: true })
  deadline: Date;

  @Column({ nullable: true })
  phase: string;

  @Column({ type: 'date', nullable: true })
  assigningDate: Date;

  @Column({ nullable: true })
  deploymentLink: string;

  @Column({ type: 'decimal', nullable: true })
  totalPayment: number;

  @Column({ type: 'decimal', nullable: true })
  paymentReceived: number;

  @Column('text', { nullable: true })
  assignedPeople: string;
}
