import { EmployeeService } from './employee.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';
export declare class EmployeeController {
    private readonly employeeService;
    constructor(employeeService: EmployeeService);
    create(createEmployeeDto: CreateEmployeeDto): Promise<import("./employee.entity").Employee>;
    fixRoles(): Promise<{
        message: string;
    }>;
    getCount(companyId?: string): Promise<{
        count: number;
    }>;
    findAll(query: any): Promise<{
        id: string;
        userId: string;
        companyId: string;
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
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            isActive: boolean;
            avatar: any;
        } | null;
        company: {
            id: string;
            name: string;
            email: string;
        } | null;
        department: {
            id: string;
            name: string;
        } | null;
    }[]>;
    findOne(id: string): Promise<import("./employee.entity").Employee | null>;
    update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<import("./employee.entity").Employee | null>;
    remove(id: string): Promise<void>;
}
