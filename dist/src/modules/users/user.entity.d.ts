import { Company } from '../companies/company.entity';
import { Department } from '../departments/department.entity';
import { Role } from '../access-control/role.entity';
import { Permission } from '../access-control/permission.entity';
export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    isActive: boolean;
    company: Company;
    department: Department;
    roles: Role[];
    permissions: Permission[];
    createdAt: Date;
    updatedAt: Date;
}
