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
    findAll(query: any): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<any>;
    private transformEmployee;
    remove(id: string): Promise<void>;
}
