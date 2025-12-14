import { Company } from '../companies/company.entity';
import { User } from '../users/user.entity';
export declare class Department {
    id: string;
    name: string;
    companyId: string;
    company: Company;
    users: User[];
    manager: User;
    managerId: string;
    createdAt: Date;
    updatedAt: Date;
}
