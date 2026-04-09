import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Job } from './job.entity';

export type ApplicationStatus =
  | 'PENDING'
  | 'REVIEWED'
  | 'SHORTLISTED'
  | 'REJECTED'
  | 'CALL DONE'
  | 'INTERVIEW DONE'
  | 'GOOGLE MEET DONE'
  | 'SELECTED';

@Entity({ name: 'applications' })
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Job, (job) => job.applications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @Column({ nullable: true })
  jobId: string;

  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  experience: string;

  @Column({ nullable: true })
  location: string;

  @Column({ default: 'PENDING' })
  status: ApplicationStatus;

  @CreateDateColumn()
  createdAt: Date;
}
