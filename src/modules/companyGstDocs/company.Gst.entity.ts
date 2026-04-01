import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('companies') // This creates the 'companies' table in PostgreSQL
export class CompanyGst {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    gstNumber?: string;

    @Column({ nullable: true })
    panNumber?: string;

    @Column({ nullable: true })
    accountName?: string;

    @Column({ nullable: true })
    accountNumber?: string;

    @Column({ nullable: true })
    ifscCode?: string;

    @Column({ nullable: true })
    bankName?: string;

    @Column({ nullable: true })
    branchName?: string;

    @Column({ nullable: true })
    companyName?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}