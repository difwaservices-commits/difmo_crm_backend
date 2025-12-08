import { User } from '../users/user.entity';
import { Company } from '../companies/company.entity';
import { Department } from '../departments/department.entity';
export declare class Employee {
    id: string;
    user: User;
    userId: string;
    employeeCode: string;
    company: Company;
    companyId: string;
    department: Department;
    departmentId: string;
    role: string;
    hireDate: Date;
    salary: string;
    manager: string;
    branch: string;
    employmentType: string;
    status: string;
    address: string;
    emergencyContact: string;
    emergencyPhone: string;
    skills: string[];
    createdAt: Date;
    updatedAt: Date;
}
