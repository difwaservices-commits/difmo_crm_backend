import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Company } from '../companies/company.entity';
import { Permission } from './permission.entity';

@Entity()
export class Role {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @ManyToOne(() => Company, { nullable: true })
    company: Company; // Null means global role (e.g., Super Admin)

    @ManyToMany(() => Permission)
    @JoinTable()
    permissions: Permission[];
}
