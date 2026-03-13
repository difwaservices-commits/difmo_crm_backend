import { JwtService } from '@nestjs/jwt';
import { CompanyService } from '../companies/company.service';
import { UserService } from '../users/user.service';
import { EmployeeService } from '../employees/employee.service';
export declare class AuthService {
    private companyService;
    private userService;
    private employeeService;
    private jwtService;
    constructor(companyService: CompanyService, userService: UserService, employeeService: EmployeeService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: any;
        employeeId: any;
    }>;
    register(data: any): Promise<{
        company: import("../companies/company.entity").Company;
        user: import("../users/user.entity").User;
    }>;
}
