import { Company } from '../companies/company.entity';
import { User } from '../users/user.entity';
export declare class Department {
    id: string;
    name: string;
    company: Company;
    users: User[];
    createdAt: Date;
    updatedAt: Date;
}
