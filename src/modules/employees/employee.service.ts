import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';

import { UserService } from '../users/user.service';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(Employee)
        private employeeRepository: Repository<Employee>,
        private userService: UserService,
    ) { }

    async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
        let userId = createEmployeeDto.userId;

        // If no userId provided, create a new user
        if (!userId && createEmployeeDto.email) {
            console.log('[EmployeeService] Creating new user for employee:', createEmployeeDto.email);

            // Check if user already exists
            const existingUser = await this.userService.findByEmail(createEmployeeDto.email);
            if (existingUser) {
                console.log('[EmployeeService] User already exists, using existing userId:', existingUser.id);
                userId = existingUser.id;
            } else {
                // Create new user
                const newUser = await this.userService.create({
                    email: createEmployeeDto.email,
                    password: createEmployeeDto.password || 'Welcome123!', // Default password
                    firstName: createEmployeeDto.firstName,
                    lastName: createEmployeeDto.lastName,
                    phone: createEmployeeDto.phone,
                    companyId: createEmployeeDto.companyId,
                    isActive: true
                });
                userId = newUser.id;
                console.log('[EmployeeService] Created new user with ID:', userId);
            }
        }

        if (!userId) {
            throw new Error('User ID is required or sufficient details to create a user');
        }

        const employee = this.employeeRepository.create({
            ...createEmployeeDto,
            userId
        });

        // Generate Employee Code
        const count = await this.employeeRepository.count();
        const code = `DIF${(count + 1).toString().padStart(4, '0')}`;
        employee.employeeCode = code;

        return this.employeeRepository.save(employee);
    }

    async findAll(filters?: any): Promise<Employee[]> {
        console.log('[EmployeeService] findAll called with filters:', JSON.stringify(filters));

        const query = this.employeeRepository.createQueryBuilder('employee')
            .leftJoinAndSelect('employee.user', 'user')
            .leftJoinAndSelect('employee.company', 'company')
            .leftJoinAndSelect('employee.department', 'department');

        if (filters?.companyId) {
            console.log('[EmployeeService] Filtering by companyId:', filters.companyId);
            query.andWhere('employee.companyId = :companyId', { companyId: filters.companyId });
        }

        if (filters?.department) {
            console.log('[EmployeeService] Filtering by department:', filters.department);
            query.andWhere('employee.departmentId = :departmentId', { departmentId: filters.department });
        }

        if (filters?.status) {
            console.log('[EmployeeService] Filtering by status:', filters.status);
            query.andWhere('employee.status = :status', { status: filters.status });
        }

        if (filters?.employmentType) {
            console.log('[EmployeeService] Filtering by employmentType:', filters.employmentType);
            query.andWhere('employee.employmentType = :employmentType', { employmentType: filters.employmentType });
        }

        if (filters?.branch) {
            console.log('[EmployeeService] Filtering by branch:', filters.branch);
            query.andWhere('employee.branch = :branch', { branch: filters.branch });
        }

        if (filters?.search) {
            console.log('[EmployeeService] Filtering by search:', filters.search);
            query.andWhere(
                '(user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search OR employee.role LIKE :search)',
                { search: `%${filters.search}%` }
            );
        }

        const sql = query.getSql();
        console.log('[EmployeeService] Generated SQL:', sql);

        const results = await query.getMany();
        console.log('[EmployeeService] Query returned', results.length, 'employees');

        return results;
    }

    async findOne(id: string): Promise<Employee | null> {
        return this.employeeRepository.findOne({
            where: { id },
            relations: ['user', 'company', 'department'],
        });
    }

    async findByUserId(userId: string): Promise<Employee | null> {
        return this.employeeRepository.findOne({
            where: { userId },
            relations: ['user', 'company', 'department'],
        });
    }

    async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee | null> {
        await this.employeeRepository.update(id, updateEmployeeDto);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.employeeRepository.delete(id);
    }

    async count(companyId?: string): Promise<number> {
        const query = this.employeeRepository.createQueryBuilder('employee');

        if (companyId) {
            query.where('employee.companyId = :companyId', { companyId });
        }

        return query.getCount();
    }
}
