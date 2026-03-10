export declare enum EmployeeBranch {
    NEW_YORK = "New York",
    WASHINGTON = "Washington",
    HEADQUARTER = "Headquarter",
    SINGAPUR = "Singapur",
    REMOTE = "Remote"
}
export declare enum EmploymentType {
    FULL_TIME = "full-time",
    PART_TIME = "part-time",
    CONTRACT_BASE = "contract-base",
    INTERN = "intern"
}
export declare enum EmployeeStatus {
    ACTIVE = "Active",
    PENDING = "Pending",
    ON_LEAVE = "On-Leave",
    TERMINATED = "Terminated"
}
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
    branch?: EmployeeBranch;
    employmentType?: EmploymentType;
    status?: EmployeeStatus;
    address?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    skills?: string[];
    roleIds?: string[];
}
export declare class UpdateEmployeeDto {
    firstName?: string;
    lastName?: string;
    departmentId?: string;
    role?: string;
    hireDate?: string;
    salary?: string;
    manager?: string;
    branch?: EmployeeBranch;
    employmentType?: EmploymentType;
    status?: EmployeeStatus;
    address?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    skills?: string[];
    roleIds?: string[];
}
