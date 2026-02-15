import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  action: string; // e.g., 'create', 'read', 'update', 'delete'

  @Column()
  resource: string; // e.g., 'user', 'task', 'company'

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  conditions: string; // JSON string representing ABAC conditions (e.g. "{ \"departmentId\": \"${user.departmentId}\" }")
}
