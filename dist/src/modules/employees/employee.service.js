"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_entity_1 = require("./employee.entity");
const user_service_1 = require("../users/user.service");
const mailer_1 = require("@nestjs-modules/mailer");
const company_entity_1 = require("../companies/company.entity");
let EmployeeService = class EmployeeService {
    employeeRepository;
    companyRepository;
    userService;
    mailerService;
    constructor(employeeRepository, companyRepository, userService, mailerService) {
        this.employeeRepository = employeeRepository;
        this.companyRepository = companyRepository;
        this.userService = userService;
        this.mailerService = mailerService;
    }
    async create(createEmployeeDto) {
        let userId = createEmployeeDto.userId;
        const { roleIds, permissionIds, ...dto } = createEmployeeDto;
        if (!userId && createEmployeeDto.email) {
            const existingUser = await this.userService.findByEmail(createEmployeeDto.email);
            if (existingUser) {
                userId = existingUser.id;
            }
            else {
                const newUser = await this.userService.create({
                    email: createEmployeeDto.email,
                    password: createEmployeeDto.password || 'Welcome123!',
                    firstName: createEmployeeDto.firstName,
                    lastName: createEmployeeDto.lastName,
                    phone: createEmployeeDto.phone,
                    companyId: createEmployeeDto.companyId,
                    isActive: true,
                });
                userId = newUser.id;
            }
        }
        if (!userId) {
            throw new Error('User ID is required or sufficient details to create a user');
        }
        if (roleIds && roleIds.length > 0) {
            const user = await this.userService.findById(userId);
            if (user) {
                if (roleIds) {
                    user.roles = await this.userService.findRolesByIds(roleIds);
                }
                if (permissionIds) {
                    user.permissions = await this.userService.findPermissionsByIds(permissionIds);
                }
                await this.userService.saveUser(user);
            }
        }
        else if (permissionIds && permissionIds.length > 0) {
            const user = await this.userService.findById(userId);
            if (user) {
                user.permissions = await this.userService.findPermissionsByIds(permissionIds);
                await this.userService.saveUser(user);
            }
        }
        else {
            await this.userService.assignRole(userId, 'Employee');
        }
        const employee = this.employeeRepository.create({
            ...dto,
            userId,
        });
        const count = await this.employeeRepository.count();
        const code = `DIF${(count + 1).toString().padStart(4, '0')}`;
        employee.employeeCode = code;
        const savedEmployee = await this.employeeRepository.save(employee);
        try {
            if (createEmployeeDto.email) {
                const company = await this.companyRepository.findOne({
                    where: { id: savedEmployee.companyId },
                });
                console.log(`[EmployeeService] Attempting to send welcome email to ${createEmployeeDto.email}`);
                await this.mailerService.sendMail({
                    to: createEmployeeDto.email,
                    subject: `Welcome to ${company?.name || 'the Team'}!`,
                    template: './welcome',
                    context: {
                        name: `${createEmployeeDto.firstName} ${createEmployeeDto.lastName}`,
                        companyName: company?.name || 'Our Company',
                        loginUrl: 'http://localhost:5173/login',
                        year: new Date().getFullYear(),
                    },
                }).catch(err => {
                    console.error('[EmployeeService] Mailer Error (handled):', err.message);
                });
            }
        }
        catch (error) {
            console.error('[EmployeeService] Critical failure in email logic (skipped):', error.message);
        }
        return savedEmployee;
    }
    async findAll(filters) {
        console.log('[EmployeeService] findAll called with filters:', JSON.stringify(filters));
        const query = this.employeeRepository
            .createQueryBuilder('employee')
            .where('employee.isDeleted = :isDeleted', { isDeleted: false })
            .leftJoinAndSelect('employee.user', 'user')
            .leftJoinAndSelect('user.roles', 'roles')
            .leftJoinAndSelect('user.permissions', 'permissions')
            .leftJoinAndSelect('roles.permissions', 'rolePermissions')
            .leftJoinAndSelect('employee.company', 'company')
            .leftJoinAndSelect('employee.department', 'department')
            .leftJoinAndSelect('employee.designation', 'designation');
        if (filters?.companyId) {
            console.log('[EmployeeService] Filtering by companyId:', filters.companyId);
            query.andWhere('employee.companyId = :companyId', {
                companyId: filters.companyId,
            });
        }
        if (filters?.userId) {
            console.log('[EmployeeService] Filtering by userId:', filters.userId);
            query.andWhere('employee.userId = :userId', { userId: filters.userId });
        }
        if (filters?.department) {
            console.log('[EmployeeService] Filtering by department:', filters.department);
            query.andWhere('employee.departmentId = :departmentId', {
                departmentId: filters.department,
            });
        }
        if (filters?.status) {
            console.log('[EmployeeService] Filtering by status:', filters.status);
            query.andWhere('employee.status = :status', { status: filters.status });
        }
        if (filters?.employmentType) {
            console.log('[EmployeeService] Filtering by employmentType:', filters.employmentType);
            query.andWhere('employee.employmentType = :employmentType', {
                employmentType: filters.employmentType,
            });
        }
        if (filters?.branch) {
            console.log('[EmployeeService] Filtering by branch:', filters.branch);
            query.andWhere('employee.branch = :branch', { branch: filters.branch });
        }
        if (filters?.search) {
            console.log('[EmployeeService] Filtering by search:', filters.search);
            query.andWhere('(user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search OR employee.role LIKE :search)', { search: `%${filters.search}%` });
        }
        const sql = query.getSql();
        console.log('[EmployeeService] Generated SQL:', sql);
        const results = await query.getMany();
        console.log('[EmployeeService] Query returned', results.length, 'employees');
        return results;
    }
    async findOne(id) {
        return this.employeeRepository.findOne({
            where: { id },
            relations: [
                'user',
                'user.roles',
                'user.roles.permissions',
                'user.permissions',
                'company',
                'department',
                'designation',
            ],
        });
    }
    async findByUserId(userId) {
        return this.employeeRepository.findOne({
            where: { userId },
            relations: ['user', 'company', 'department'],
        });
    }
    async update(id, updateEmployeeDto) {
        console.log('[EmployeeService] Updating employee:', id, updateEmployeeDto);
        try {
            const employee = await this.findOne(id);
            if (!employee) {
                console.log('[EmployeeService] Employee not found:', id);
                return null;
            }
            const firstName = updateEmployeeDto.firstName;
            const lastName = updateEmployeeDto.lastName;
            const email = updateEmployeeDto.email;
            const phone = updateEmployeeDto.phone;
            const password = updateEmployeeDto.password;
            const roleIds = updateEmployeeDto.roleIds;
            const permissionIds = updateEmployeeDto.permissionIds;
            const employeeUpdate = {};
            const validFields = [
                'companyId',
                'departmentId',
                'designationId',
                'role',
                'hireDate',
                'salary',
                'manager',
                'branch',
                'employmentType',
                'status',
                'address',
                'emergencyContact',
                'emergencyPhone',
                'skills',
            ];
            validFields.forEach((field) => {
                if (updateEmployeeDto[field] !== undefined) {
                    employeeUpdate[field] = updateEmployeeDto[field];
                }
            });
            if (firstName ||
                lastName ||
                email ||
                phone ||
                password ||
                roleIds ||
                permissionIds) {
                if (employee.userId) {
                    const userUpdate = {};
                    if (firstName)
                        userUpdate.firstName = firstName;
                    if (lastName)
                        userUpdate.lastName = lastName;
                    if (email)
                        userUpdate.email = email;
                    if (phone)
                        userUpdate.phone = phone;
                    if (password)
                        userUpdate.password = password;
                    const user = await this.userService.update(employee.userId, userUpdate);
                    if (roleIds) {
                        user.roles = await this.userService.findRolesByIds(roleIds);
                    }
                    if (permissionIds) {
                        user.permissions = await this.userService.findPermissionsByIds(permissionIds);
                    }
                    if (roleIds || permissionIds) {
                        await this.userService.saveUser(user);
                    }
                }
            }
            console.log('[EmployeeService] Updating employee record:', employeeUpdate);
            await this.employeeRepository.update(id, employeeUpdate);
            return this.findOne(id);
        }
        catch (error) {
            console.error('[EmployeeService] Update failed:', error);
            throw error;
        }
    }
    async remove(id) {
        try {
            const employee = await this.employeeRepository.findOne({
                where: { id, isDeleted: false },
            });
            if (!employee) {
                throw new Error('Employee not found');
            }
            await this.employeeRepository.update(id, { isDeleted: true });
            console.log(`[EmployeeService] Employee ${id} soft-deleted`);
        }
        catch (error) {
            console.error('[EmployeeService] Failed to delete employee:', error);
            throw error;
        }
    }
    async count(companyId) {
        const query = this.employeeRepository.createQueryBuilder('employee');
        if (companyId) {
            query.where('employee.companyId = :companyId', { companyId });
        }
        return query.getCount();
    }
    async fixEmployeeRoles(companyId) {
        console.log('[EmployeeService] Fixing employee roles...');
        const employees = await this.findAll({});
        let count = 0;
        let skipped = 0;
        for (const employee of employees) {
            if (employee.userId) {
                try {
                    const user = await this.userService.findById(employee.userId);
                    const isAdmin = user?.roles?.some((r) => ['Super Admin', 'Admin'].includes(r.name));
                    if (isAdmin) {
                        console.log(`[EmployeeService] Skipping user ${user?.email} as they are Admin/Super Admin`);
                        skipped++;
                        continue;
                    }
                    await this.userService.assignRole(employee.userId, 'Employee');
                    count++;
                }
                catch (e) {
                    console.error(`[EmployeeService] Failed to assign role to user ${employee.userId}:`, e);
                }
            }
        }
        return {
            message: `Fixed roles for ${count} employees. Skipped ${skipped} admins.`,
        };
    }
};
exports.EmployeeService = EmployeeService;
exports.EmployeeService = EmployeeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __param(1, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        user_service_1.UserService,
        mailer_1.MailerService])
], EmployeeService);
//# sourceMappingURL=employee.service.js.map