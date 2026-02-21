import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';
import { UserService } from '../users/user.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Company } from '../companies/company.entity';
export declare class EmployeeService {
    private employeeRepository;
    private companyRepository;
    private userService;
    private mailerService;
    constructor(employeeRepository: Repository<Employee>, companyRepository: Repository<Company>, userService: UserService, mailerService: MailerService);
    create(createEmployeeDto: CreateEmployeeDto & {
        roleIds?: string[];
    }): Promise<Employee>;
    findAll(filters?: any): Promise<Employee[]>;
    findOne(id: string): Promise<Employee | null>;
    findByUserId(userId: string): Promise<Employee | null>;
    update(id: string, updateEmployeeDto: UpdateEmployeeDto & {
        roleIds?: string[];
    }): Promise<Employee | null>;
    remove(id: string): Promise<void>;
    count(companyId?: string): Promise<number>;
    fixEmployeeRoles(companyId?: string): Promise<{
        message: string;
    }>;
}
