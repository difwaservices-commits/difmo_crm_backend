import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../access-control/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
    ) { }

    async create(createUserDto: Partial<CreateUserDto> & { phone?: string, companyId?: string }): Promise<User> {
        if (!createUserDto.password) {
            throw new Error('Password is required');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const { companyId, ...userData } = createUserDto;

        const user = this.userRepository.create({
            ...userData,
            password: hashedPassword,
            company: companyId ? { id: companyId } : undefined,
            isActive: true
        } as any) as unknown as User;

        await this.userRepository.save(user);

        // Assign default role if needed, but for employees we do it explicitly

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { email },
            relations: ['company', 'roles', 'roles.permissions']
        });
    }

    async findById(id: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { id },
            relations: ['company', 'roles', 'roles.permissions']
        });
    }

    async update(id: string, updateUserDto: Partial<User>): Promise<User> {
        await this.userRepository.update(id, updateUserDto);
        const user = await this.findById(id);
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        return user;
    }

    async assignRole(userId: string, roleName: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['roles']
        });

        if (!user) {
            throw new Error('User not found');
        }

        let role = await this.roleRepository.findOne({ where: { name: roleName } });

        if (!role) {
            // Create role if it doesn't exist (e.g., 'Employee')
            console.log(`[UserService] Role '${roleName}' not found, creating...`);
            role = this.roleRepository.create({
                name: roleName,
                description: `Default ${roleName} role`,
            });
            await this.roleRepository.save(role);
        }

        // Check if user already has this role
        const hasRole = user.roles.some(r => r.id === role.id);
        if (!hasRole) {
            if (!user.roles) user.roles = [];
            user.roles.push(role);
            await this.userRepository.save(user);
            console.log(`[UserService] Assigned role '${roleName}' to user ${user.email}`);
        }

        return user;
    }
}
