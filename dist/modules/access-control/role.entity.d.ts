import { Company } from '../companies/company.entity';
import { Permission } from './permission.entity';
export declare class Role {
    id: string;
    name: string;
    description: string;
    company: Company;
    permissions: Permission[];
}
