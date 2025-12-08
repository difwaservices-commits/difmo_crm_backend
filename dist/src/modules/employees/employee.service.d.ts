import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';
import { UserService } from '../users/user.service';
export declare class EmployeeService {
    private employeeRepository;
    private userService;
    constructor(employeeRepository: Repository<Employee>, userService: UserService);
    create(createEmployeeDto: CreateEmployeeDto): Promise<Employee>;
    findAll(filters?: any): Promise<Employee[]>;
    findOne(id: string): Promise<Employee | null>;
    findByUserId(userId: string): Promise<Employee | null>;
    update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee | null>;
    remove(id: string): Promise<void>;
    count(companyId?: string): Promise<number>;
}
