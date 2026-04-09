import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Application } from './application.entity';

@Entity({ name: 'jobs' })
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  experience: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ type: 'simple-json', nullable: true })
  responsibilities: string[];

  @Column({ type: 'simple-json', nullable: true })
  requirements: string[];

  @Column({ type: 'timestamptz', nullable: true })
  applicationStartDate: Date;

  @Column({ type: 'timestamptz', nullable: true })
  applicationEndDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Application, (app) => app.job)
  applications: Application[];
}
