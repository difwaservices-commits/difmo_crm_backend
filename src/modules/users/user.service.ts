import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
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
        } as any) as unknown as User;
        return this.userRepository.save(user);
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
}
