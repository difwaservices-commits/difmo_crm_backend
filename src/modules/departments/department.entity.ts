import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Company } from '../companies/company.entity';
import { User } from '../users/user.entity';

@Entity()
export class Department {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    companyId: string;

    @ManyToOne(() => Company, (company) => company.departments)
    @JoinColumn({ name: 'companyId' })
    company: Company;

    @OneToMany(() => User, (user) => user.department)
    users: User[];

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'managerId' })
    manager: User;

    @Column({ nullable: true })
    managerId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
