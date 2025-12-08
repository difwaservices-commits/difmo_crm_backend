import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
export declare class AuthController {
    private authService;
    private userService;
    constructor(authService: AuthService, userService: UserService);
    login(req: any): Promise<{
        access_token: string;
        user: any;
    }>;
    register(body: any): Promise<{
        company: import("../companies/company.entity").Company;
        user: import("../users/user.entity").User;
    }>;
    getProfile(req: any): Promise<import("../users/user.entity").User | null>;
}
