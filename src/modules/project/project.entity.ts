import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('add-projects')
export class AllProject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  projectName: string;

  @Column({ nullable: true })
  githubLink: string;

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
