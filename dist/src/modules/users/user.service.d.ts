import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../access-control/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UserService {
    private userRepository;
    private roleRepository;
    constructor(userRepository: Repository<User>, roleRepository: Repository<Role>);
    create(createUserDto: Partial<CreateUserDto> & {
        phone?: string;
        companyId?: string;
    }): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    update(id: string, updateUserDto: Partial<User>): Promise<User>;
    findRolesByIds(ids: string[]): Promise<Role[]>;
    saveUser(user: User): Promise<User>;
    assignRole(userId: string, roleName: string): Promise<User>;
}
