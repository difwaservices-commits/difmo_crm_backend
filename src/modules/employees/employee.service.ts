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

        if (!userId && createEmployeeDto.email) {
            console.log('[EmployeeService] Creating new user for employee:', createEmployeeDto.email);

            const existingUser = await this.userService.findByEmail(createEmployeeDto.email);
            if (existingUser) {
                console.log('[EmployeeService] User already exists, using existing userId:', existingUser.id);
                userId = existingUser.id;
            } else {
                const newUser = await this.userService.create({
                    email: createEmployeeDto.email,
                    password: createEmployeeDto.password || 'Welcome123!',
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

        // Check if user exists and is Admin before assigning Employee role
        const user = await this.userService.findById(userId);
        const isAdmin = user?.roles?.some(r => ['Super Admin', 'Admin'].includes(r.name));

        if (!isAdmin) {
            // Ensure the user has the 'Employee' role only if not admin
            await this.userService.assignRole(userId, 'Employee');
        } else {
            console.log(`[EmployeeService] Skipping Role assignment for user ${user?.email} as they are Admin/Super Admin`);
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
            //.leftJoinAndSelect('user.roles', 'roles') // Explicitly join roles if needed for filtering
            .leftJoinAndSelect('employee.company', 'company')
            .leftJoinAndSelect('employee.department', 'department');

        // ... rest of filters

        if (filters?.companyId) {
            console.log('[EmployeeService] Filtering by companyId:', filters.companyId);
            query.andWhere('employee.companyId = :companyId', { companyId: filters.companyId });
        }

        if (filters?.userId) {
            console.log('[EmployeeService] Filtering by userId:', filters.userId);
            query.andWhere('employee.userId = :userId', { userId: filters.userId });
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
        console.log('[EmployeeService] Updating employee:', id, updateEmployeeDto);
        try {
            const employee = await this.findOne(id);
            if (!employee) {
                console.log('[EmployeeService] Employee not found:', id);
                return null;
            }

            // Update User details if provided
            if (updateEmployeeDto.firstName || updateEmployeeDto.lastName) {
                const userUpdate: any = {};
                if (updateEmployeeDto.firstName) userUpdate.firstName = updateEmployeeDto.firstName;
                if (updateEmployeeDto.lastName) userUpdate.lastName = updateEmployeeDto.lastName;

                if (employee.userId) {
                    console.log('[EmployeeService] Updating user:', employee.userId, userUpdate);
                    await this.userService.update(employee.userId, userUpdate);
                }
            }

            // Remove user fields from DTO before updating employee to avoid errors
            const { firstName, lastName, ...employeeUpdate } = updateEmployeeDto;

            console.log('[EmployeeService] Updating employee record:', employeeUpdate);
            await this.employeeRepository.update(id, employeeUpdate);
            return this.findOne(id);
        } catch (error) {
            console.error('[EmployeeService] Update failed:', error);
            throw error;
        }
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

    async fixEmployeeRoles(companyId?: string) {
        console.log('[EmployeeService] Fixing employee roles...');
        const employees = await this.findAll({}); // Get all
        let count = 0;
        let skipped = 0;

        for (const employee of employees) {
            if (employee.userId) {
                try {
                    // Check if user already has Admin/Super Admin role
                    const user = await this.userService.findById(employee.userId);
                    const isAdmin = user?.roles?.some(r => ['Super Admin', 'Admin'].includes(r.name));

                    if (isAdmin) {
                        console.log(`[EmployeeService] Skipping user ${user?.email} as they are Admin/Super Admin`);
                        skipped++;
                        continue;
                    }

                    await this.userService.assignRole(employee.userId, 'Employee');
                    count++;
                } catch (e) {
                    console.error(`[EmployeeService] Failed to assign role to user ${employee.userId}:`, e);
                }
            }
        }
        return { message: `Fixed roles for ${count} employees. Skipped ${skipped} admins.` };
    }
}
