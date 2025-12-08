import { JwtService } from '@nestjs/jwt';
import { CompanyService } from '../companies/company.service';
import { UserService } from '../users/user.service';
export declare class AuthService {
    private companyService;
    private userService;
    private jwtService;
    constructor(companyService: CompanyService, userService: UserService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: any;
    }>;
    register(data: any): Promise<{
        company: import("../companies/company.entity").Company;
        user: import("../users/user.entity").User;
    }>;
}
