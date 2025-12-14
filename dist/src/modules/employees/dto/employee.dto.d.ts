export declare class CreateEmployeeDto {
    userId?: string;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    companyId?: string;
    departmentId?: string;
    role: string;
    hireDate: string;
    salary?: string;
    manager?: string;
    branch?: string;
    employmentType?: string;
    status?: string;
    address?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    skills?: string[];
}
export declare class UpdateEmployeeDto {
    firstName?: string;
    lastName?: string;
    departmentId?: string;
    role?: string;
    hireDate?: string;
    salary?: string;
    manager?: string;
    branch?: string;
    employmentType?: string;
    status?: string;
    address?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    skills?: string[];
}
