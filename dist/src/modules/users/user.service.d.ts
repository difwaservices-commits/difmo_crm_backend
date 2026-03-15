import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../access-control/role.entity';
import { Permission } from '../access-control/permission.entity';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UserService {
    private userRepository;
    private roleRepository;
    private permissionRepository;
    constructor(userRepository: Repository<User>, roleRepository: Repository<Role>, permissionRepository: Repository<Permission>);
    create(createUserDto: Partial<CreateUserDto> & {
        phone?: string;
        companyId?: string;
    }): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    update(id: string, data: Partial<User>): Promise<User>;
    saveUser(user: User): Promise<User>;
    updateProfile(userId: string, data: Partial<User>): Promise<User>;
    findRolesByIds(ids: string[]): Promise<Role[]>;
    findPermissionsByIds(ids: string[]): Promise<Permission[]>;
    assignRole(userId: string, roleName: string): Promise<User>;
}
