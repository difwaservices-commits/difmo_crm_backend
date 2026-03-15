import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
export declare class AuthController {
    private authService;
    private userService;
    constructor(authService: AuthService, userService: UserService);
    login(req: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            name: string;
            phone: any;
            company: any;
            role: any;
            roles: any;
            permissions: any;
        };
    }>;
    register(body: any): Promise<{
        company: import("../companies/company.entity").Company;
        user: import("../users/user.entity").User;
    }>;
    getProfile(req: any): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        name: string;
        phone: string;
        company: import("../companies/company.entity").Company;
        department: import("../departments/department.entity").Department;
        role: string;
        roles: import("../access-control/role.entity").Role[];
        permissions: import("../access-control/permission.entity").Permission[];
    }>;
    updateProfile(req: any, body: any): Promise<import("../users/user.entity").User>;
}
